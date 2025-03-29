import type { z } from 'zod';

import { Buffer } from 'node:buffer';

import {
  type Content,
  FunctionCallingMode,
  type GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { SdkAIModelT, SdkMessageT } from '@llm/sdk';
import type { SearchEnginesService } from '~/modules/search-engines';

import { isDataUrl, rejectFalsyItems, tryOrThrowTE } from '@llm/commons';
import { createWebSearchFunctionGeminiTool, createWebSearchResultsPrompt } from '~/modules/prompts';

import { AIConnectionCreatorError } from '../ai-connector.errors';
import {
  AIProxy,
  type AIProxyInstructedAttrs,
  type AIProxyPromptAttrs,
  type AIProxyStreamPromptAttrs,
} from './ai-proxy';

const DEFAULT_CLIENT_CONFIG = {
  temperature: 0.7,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

export class AIGeminiProxy extends AIProxy {
  private readonly client: GenerativeModel;

  constructor(
    aiModel: SdkAIModelT,
    searchEnginesService: SearchEnginesService,
  ) {
    super(aiModel, searchEnginesService);

    const { apiKey, apiModel } = this.credentials;
    const genAI = new GoogleGenerativeAI(apiKey);

    this.client = genAI.getGenerativeModel({ model: apiModel });
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
    }: AIProxyStreamPromptAttrs,
  ) {
    const { webSearch } = message;
    const executeSearchWeb = async () => {
      const client = this.client.startChat(
        {
          generationConfig: DEFAULT_CLIENT_CONFIG,
          tools: [
            {
              functionDeclarations: [
                createWebSearchFunctionGeminiTool(),
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
            generationConfig: DEFAULT_CLIENT_CONFIG,
            history: normalizeGeminiMessagesToCompletion(history),

            ...context && {
              systemInstruction: {
                role: 'system',
                parts: [
                  {
                    text: context,
                  },
                ],
              },
            },
          });

          const result = await chat.sendMessageStream(
            rejectFalsyItems(
              [
                message?.content || '',
                searchResults,
              ],
            ).join('\n---\n'),
            { signal },
          );

          return result.stream;
        },
      ),
      TE.map(
        stream => (async function* () {
          for await (const chunk of stream) {
            yield chunk.text();
          }
        })(),
      ),
    );
  }

  executeInstructedPrompt<Z extends z.AnyZodObject>({ history = [], message, schema }: AIProxyInstructedAttrs<Z>) {
    return AIConnectionCreatorError.tryCatch(
      async () => {
        const chat = this.client.startChat({
          history: normalizeGeminiMessagesToCompletion(history),
          generationConfig: DEFAULT_CLIENT_CONFIG,
          systemInstruction: {
            role: 'system',
            parts: [
              {
                text: collectSystemMessages(history),
              },
            ],
          },
        });

        const result = await chat.sendMessage(
          [
            `Return response in JSON format following this schema: ${schema.toString()}.',
            'Message: ${message}`,
          ].join('\n'),
        );

        const responseText = result.response.text();

        // Try to extract JSON from code blocks like ```json { ... } ```
        const jsonMatch = responseText.match(/```(?:json)?([^`]*)```/);
        const jsonText = jsonMatch ? jsonMatch[1].trim() : responseText;

        return JSON.parse(jsonText);
      },
    );
  }

  executePrompt({ history = [], message }: AIProxyPromptAttrs) {
    return AIConnectionCreatorError.tryCatch(
      async () => {
        const chat = this.client.startChat({
          history: normalizeGeminiMessagesToCompletion(history),
          generationConfig: DEFAULT_CLIENT_CONFIG,
          systemInstruction: {
            role: 'system',
            parts: [
              {
                text: collectSystemMessages(history),
              },
            ],
          },
        });

        const content = typeof message === 'string' ? message : message.content;

        // Multimedia response
        if (typeof content !== 'string') {
          const imageResponse = (
            isDataUrl(content.imageUrl)
              ? await fetch(content.imageUrl)
                .then(response => response.arrayBuffer())
                .then(buffer => Buffer.from(buffer).toString('base64'))
              : content.imageUrl
          );

          const result = await this.client.generateContent([
            {
              inlineData: {
                data: imageResponse,
                mimeType: `image/${content.imageUrl.split('.').pop()}`,
              },
            },
            content.text,
          ]);

          return result.response.text();
        }

        // Classical response
        const result = await chat.sendMessage(content);

        return result.response.text();
      },
    );
  }
}

function normalizeGeminiMessagesToCompletion(messages: SdkMessageT[]): Content[] {
  return messages
    .filter(({ role }) => role !== 'system')
    .map(({ content, role }) => ({
      role: role === 'assistant' ? 'model' : role,
      parts: [{ text: content }],
    }));
}

function collectSystemMessages(messages: SdkMessageT[]): string {
  return messages
    .filter(({ role }) => role === 'system')
    .map(({ content }) => content)
    .join('\n');
}
