import type { z } from 'zod';

import {
  type Content,
  type EnhancedGenerateContentResponse,
  FunctionCallingMode,
  type FunctionDeclaration,
  type GenerativeModel,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  type Part,
} from '@google/generative-ai';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { SdkAIModelT, SdkMessageT } from '@dashhub/sdk';
import type { TableId } from '~/modules/database';
import type { SearchEnginesService } from '~/modules/search-engines';

import { isDataUrl, rejectFalsyItems, tryOrThrowTE } from '@dashhub/commons';
import { LoggerService } from '~/modules/logger';
import { createWebSearchAIFunction, createWebSearchResultsPrompt } from '~/modules/prompts';

import { AIConnectionCreatorError } from '../ai-connector.errors';
import {
  AIProxy,
  type AIProxyAsyncFunction,
  type AIProxyInstructedAttrs,
  type AIProxyMessage,
  type AIProxyPromptAttrs,
  type AIProxyStreamChunk,
  type AIProxyStreamPromptAttrs,
} from './ai-proxy';

const DEFAULT_CLIENT_CONFIG = {
  temperature: 0.7,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

export class AIGeminiProxy extends AIProxy {
  private readonly client: GenerativeModel;
  private readonly logger = LoggerService.of('AIGeminiProxy');

  constructor(
    aiModel: SdkAIModelT,
    searchEnginesService: SearchEnginesService,
  ) {
    super(aiModel, searchEnginesService);

    const { apiKey, apiModel } = this.credentials;
    const genAI = new GoogleGenerativeAI(apiKey);

    this.client = genAI.getGenerativeModel({
      model: apiModel,
      safetySettings: SAFETY_SETTINGS,
      generationConfig: DEFAULT_CLIENT_CONFIG,
    });
  }

  executeEmbeddingPrompt(input: string) {
    return AIConnectionCreatorError.tryCatch(async () => {
      const embeddingModel = await this.client.embedContent(input);

      return embeddingModel.embedding.values;
    });
  }

  executeStreamPrompt(
    {
      history,
      context,
      message,
      organization,
      signal,
      asyncFunctions = [],
    }: AIProxyStreamPromptAttrs,
  ) {
    const { webSearch } = message;
    const systemMessages = rejectFalsyItems([
      context,
      collectSystemMessages(history),
    ]).join('\n');

    const tools: FunctionDeclaration[] = [
      ...(message.webSearch ? [createWebSearchAIFunction() as FunctionDeclaration] : []),
      ...asyncFunctions.map(fn => fn.definition as FunctionDeclaration),
    ];

    const executeSearchWeb = async () => {
      const client = this.client.startChat(
        {
          generationConfig: DEFAULT_CLIENT_CONFIG,
          tools: [
            {
              functionDeclarations: [
                createWebSearchAIFunction() as FunctionDeclaration,
              ],
            },
          ],
          toolConfig: {
            functionCallingConfig: {
              mode: FunctionCallingMode.ANY,
            },
          },
        },
      );

      const result = await client.sendMessage(
        message?.content || '',
        { signal },
      );

      const functionCall = result.response?.candidates?.[0].content.parts[0]?.functionCall;

      if (!functionCall || functionCall.name !== 'WebSearch') {
        return [];
      }

      const args = typeof functionCall.args === 'string'
        ? JSON.parse(functionCall.args)
        : functionCall.args;

      const results = await pipe(
        this.searchEnginesService.getDefaultSearchEngineProxy(organization.id),
        TE.chainW(searchEngine => searchEngine.executeQuery({
          query: args.query,
          results: Math.min(args.results ?? 30, 30),
          language: args.language ?? 'en',
        })),
        tryOrThrowTE,
      )();

      return results;
    };

    return pipe(
      AIConnectionCreatorError.tryCatch(
        async () => {
          let searchResults: string | null = null;

          if (webSearch) {
            searchResults = createWebSearchResultsPrompt(await executeSearchWeb());
          }

          const chat = this.client.startChat({
            history: normalizeGeminiMessagesToCompletion(history),
            ...(tools.length > 0 && {
              tools: [{ functionDeclarations: tools }],
              toolConfig: {
                functionCallingConfig: {
                  mode: FunctionCallingMode.AUTO,
                },
              },
            }),
            ...(systemMessages && {
              systemInstruction: {
                role: 'system',
                parts: [{ text: systemMessages }],
              },
            }),
          });

          this.logger.info('--- Stage 1: Initiating Gemini stream call ---', { hasTools: tools.length > 0 });

          const initialResult = await chat.sendMessageStream(
            rejectFalsyItems(
              [
                message?.content || '',
                searchResults,
              ],
            ).join('\n---\n'),
            { signal },
          );

          return this.handleGeminiStream({
            stream: initialResult.stream,
            chat,
            signal,
            asyncFunctions,
            organizationId: organization.id,
            isWebSearchEnabled: message.webSearch ?? false,
          });
        },
      ),
    );
  }

  private async* handleGeminiStream(
    params: {
      stream: AsyncIterable<EnhancedGenerateContentResponse>;
      chat: ReturnType<GenerativeModel['startChat']>;
      signal?: AbortSignal;
      asyncFunctions: AIProxyAsyncFunction[];
      organizationId: TableId;
      isWebSearchEnabled: boolean;
    },
  ): AsyncIterableIterator<AIProxyStreamChunk> {
    const { stream, chat, signal, asyncFunctions, organizationId, isWebSearchEnabled } = params;

    this.logger.info('--- Starting Gemini stream processing ---');

    for await (const chunk of stream) {
      if (signal?.aborted) {
        this.logger.warn('--- Stream aborted by signal ---');
        return;
      }

      const parts = chunk.candidates?.[0]?.content?.parts || [];

      // Process text parts immediately
      for (const part of parts.filter(p => p.text)) {
        if (part.text) {
          yield part.text;
        }
      }

      // Find and process function call if present
      const functionCallPart = parts.find(part => part.functionCall);
      if (!functionCallPart?.functionCall) {
        continue;
      }

      const { name, args } = functionCallPart.functionCall;
      this.logger.info(`--- Function call detected: ${name} ---`);

      const asyncFunctionResult = await this.processFunctionCall(name, args, asyncFunctions);
      if (asyncFunctionResult.chunk) {
        yield asyncFunctionResult.chunk;
      }

      if (asyncFunctionResult.functionResponsePart) {
        this.logger.info(`--- Sending function response for ${name} back to model ---`);

        const nextStreamResult = await chat.sendMessageStream(
          [asyncFunctionResult.functionResponsePart],
          { signal },
        );

        yield * this.handleGeminiStream({
          stream: nextStreamResult.stream,
          chat,
          signal,
          asyncFunctions,
          organizationId,
          isWebSearchEnabled,
        });

        return;
      }
    }

    this.logger.info('--- Finished Gemini stream processing ---');
  }

  private async processFunctionCall(
    name: string,
    args: any,
    asyncFunctions: AIProxyAsyncFunction[],
  ): Promise<{
      functionResponsePart?: Part;
      chunk?: AIProxyStreamChunk;
    }> {
    const asyncFunction = asyncFunctions.find(fn => fn.definition.name === name);
    if (!asyncFunction) {
      this.logger.warn(`Function call for unknown function: ${name}`);
      return {
        functionResponsePart: {
          functionResponse: {
            name,
            response: { content: `Error: Function '${name}' not found.` },
          },
        },
      };
    }

    try {
      const parsedArgs = typeof args === 'string' ? JSON.parse(args || '{}') : (args || {});
      this.logger.info(`Executing async function: ${name} with args:`, parsedArgs);

      const result = await asyncFunction.executor(parsedArgs);
      const functionExecutionResult = {
        externalApiId: asyncFunction.externalApi.id,
        functionName: name,
        args: parsedArgs,
        result,
      };

      this.logger.info(`Async function ${name} executed successfully.`);

      return {
        functionResponsePart: {
          functionResponse: {
            name,
            response: { content: JSON.stringify(result) },
          },
        },
        chunk: { asyncFunctionsResults: [functionExecutionResult] },
      };
    }
    catch (error: any) {
      this.logger.error(`Error executing async function ${name}:`, error);
      const errorMessage = error.message || 'Unknown error';
      const errorResult = { error: `Function execution failed: ${errorMessage}` };

      const functionExecutionResult = {
        externalApiId: asyncFunction.externalApi.id,
        functionName: name,
        args: typeof args === 'string' ? JSON.parse(args || '{}') : (args || {}),
        result: errorResult,
      };

      return {
        functionResponsePart: {
          functionResponse: {
            name,
            response: { content: JSON.stringify(errorResult) },
          },
        },
        chunk: { asyncFunctionsResults: [functionExecutionResult] },
      };
    }
  }

  executeInstructedPrompt<Z extends z.AnyZodObject>({ history = [], message, schema }: AIProxyInstructedAttrs<Z>) {
    return AIConnectionCreatorError.tryCatch(
      async () => {
        const result = await this.client.generateContent({
          contents: [
            ...normalizeGeminiMessagesToCompletion(history),
            {
              role: 'user',
              parts: [{
                text: `Extract information matching this JSON schema:\n${JSON.stringify(schema.shape)}\n\nInput text:\n${message}`,
              }],
            },
          ],
          generationConfig: {
            ...DEFAULT_CLIENT_CONFIG,
            responseMimeType: 'application/json',
          },
          ...(collectSystemMessages(history) && {
            systemInstruction: {
              role: 'system',
              parts: [{ text: collectSystemMessages(history) }],
            },
          }),
        });

        const responseText = result.response.text();
        return JSON.parse(responseText);
      },
    );
  }

  executePrompt({ history = [], message }: AIProxyPromptAttrs) {
    return AIConnectionCreatorError.tryCatch(
      async () => {
        const systemInstruction = collectSystemMessages(history);
        const normalizedHistory = normalizeGeminiMessagesToCompletion(history);
        const currentMessage = normalizeAIProxyMessageToGemini(message);

        const result = await this.client.generateContent({
          contents: [...normalizedHistory, currentMessage],
          ...(systemInstruction && {
            systemInstruction: {
              role: 'system',
              parts: [{ text: systemInstruction }],
            },
          }),
        });

        return result.response.text();
      },
    );
  }
}

function normalizeGeminiMessagesToCompletion(messages: SdkMessageT[]): Content[] {
  return messages
    .filter(({ role }) => role !== 'system')
    .map(({ content, role }) => ({
      role: role === 'assistant' ? 'model' : 'user',
      parts: [{ text: content }],
    }));
}

function normalizeAIProxyMessageToGemini(message: string | AIProxyMessage): Content {
  const msgObject = typeof message === 'string' ? { role: 'user', content: message } : message;
  const { role, content } = msgObject;

  const geminiRole = role === 'assistant' ? 'model' : 'user';

  if (typeof content === 'string') {
    return { role: geminiRole, parts: [{ text: content }] };
  }
  else {
    const imagePart = (
      isDataUrl(content.imageUrl)
        ? {
            inlineData: {
              mimeType: `image/${content.imageUrl.split('.').pop()?.split(';')[0] ?? 'jpeg'}`,
              data: content.imageUrl.split(',')[1],
            },
          }
        : { fileData: { mimeType: `image/${content.imageUrl.split('.').pop() ?? 'jpeg'}`, fileUri: content.imageUrl } }
    );

    return {
      role: geminiRole,
      parts: [
        { text: content.text },
        imagePart,
      ],
    };
  }
}

function collectSystemMessages(messages: SdkMessageT[]): string {
  return messages
    .filter(({ role }) => role === 'system')
    .map(({ content }) => content)
    .join('\n');
}
