import type { z } from 'zod';

import Instructor, { type InstructorClient } from '@instructor-ai/instructor';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { OpenAI } from 'openai';

import type { SdkAIModelT, SdkMessageT } from '@llm/sdk';
import type { TableId } from '~/modules/database';
import type { SearchEnginesService } from '~/modules/search-engines';
import type { SearchEngineResultItem } from '~/modules/search-engines/clients/search-engine-proxy';

import {
  filterMapAsyncIterator,
  flatMapAsyncIterator,
  isDangerousObjectKey,
  rejectFalsyItems,
  tapAsyncIterator,
  tryOrThrowTE,
} from '@llm/commons';
import { LoggerService } from '~/modules/logger';
import {
  createWebSearchAIFunction,
  createWebSearchResultsPrompt,
} from '~/modules/prompts';

import { AIConnectionCreatorError } from '../ai-connector.errors';
import {
  AIProxy,
  type AIProxyAsyncFunction,
  type AIProxyAsyncFunctionResult,
  type AIProxyInstructedAttrs,
  type AIProxyMessage,
  type AIProxyPromptAttrs,
  type AIProxyStreamChunk,
  type AIProxyStreamPromptAttrs,
} from './ai-proxy';

const DEFAULT_CLIENT_CONFIG = {
  temperature: 0.7,
  top_p: 1,
  max_tokens: 4096,
  frequency_penalty: 0,
  presence_penalty: 0.6,
};

export class AIOpenAIProxy extends AIProxy {
  private readonly client: OpenAI;
  private readonly instructor: InstructorClient<OpenAI>;
  private readonly logger = LoggerService.of('AIOpenAIProxy');

  constructor(
    aiModel: SdkAIModelT,
    searchEnginesService: SearchEnginesService,
  ) {
    super(aiModel, searchEnginesService);

    const { apiKey, apiModel, apiUrl } = this.credentials;

    this.client = new OpenAI({
      apiKey,
      ...apiUrl && {
        baseURL: apiUrl,
      },
    });

    this.instructor = Instructor({
      client: this.client,
      mode: determineOpenAIInstructorMode(apiModel),
    });
  }

  executeEmbeddingPrompt(input: string) {
    return AIConnectionCreatorError.tryCatch(async () => {
      const result = await this.client.embeddings.create({
        input,
        model: this.credentials.apiModel,
      });

      return result.data[0].embedding;
    });
  }

  executeStreamPrompt(
    {
      history,
      context,
      message,
      organization,
      signal,
      asyncFunctions,
    }: AIProxyStreamPromptAttrs,
  ) {
    return AIConnectionCreatorError.tryCatch(
      async () => {
        const initialMessages = rejectFalsyItems([
          context ? { role: 'system', content: context } as const : null,
          ...normalizeSdkMessagesToCompletion(history),
          message.content ? { role: 'user', content: message.content } as const : null,
        ]);

        let webSearchResults: SearchEngineResultItem[] | null = null;

        if (message.webSearch) {
          webSearchResults = await this.executeWebSearch(initialMessages, organization.id);

          if (webSearchResults?.length) {
            this.logger.info(`Web search returned ${webSearchResults.length} results.`);
            initialMessages.push({
              role: 'system',
              content: createWebSearchResultsPrompt(webSearchResults),
            });
          }
        }

        const tools = asyncFunctions?.map(fn => ({
          type: 'function',
          function: fn.definition,
        })) as OpenAI.Chat.Completions.ChatCompletionTool[] | undefined;

        const streamIterator = handleStreamingAndToolCalls({
          messages: initialMessages,
          tools,
          signal,
          webSearchResults,
          asyncFunctions: asyncFunctions || [],
          client: this.client,
          apiModel: this.credentials.apiModel,
          config: DEFAULT_CLIENT_CONFIG,
        });

        return pipe(
          streamIterator,
          flatMapAsyncIterator((chunk): AIProxyStreamChunk[] => [chunk]),
        );
      },
    );
  }

  executeInstructedPrompt<Z extends z.AnyZodObject>({ history = [], message, schema }: AIProxyInstructedAttrs<Z>) {
    return AIConnectionCreatorError.tryCatch(
      async () => this.instructor.chat.completions.create({
        ...DEFAULT_CLIENT_CONFIG,
        model: this.credentials.apiModel,
        messages: [
          ...normalizeSdkMessagesToCompletion(history),
          {
            role: 'user',
            content: message,
          },
        ],
        stream: false,
        response_model: {
          name: 'Extractor',
          schema,
        },
      }),
    );
  }

  executePrompt({ history = [], message }: AIProxyPromptAttrs) {
    return AIConnectionCreatorError.tryCatch(
      async () => {
        const result = await this.instructor.chat.completions.create({
          model: this.credentials.apiModel,
          messages: [
            ...normalizeSdkMessagesToCompletion(history),
            normalizeAIProxyMessageToCompletion(message),
          ],
        });

        return result.choices[0].message.content || '';
      },
    );
  }

  private async executeWebSearch(
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
    organizationId: TableId,
  ): Promise<SearchEngineResultItem[]> {
    try {
      const search = await this.client.chat.completions.create({
        ...DEFAULT_CLIENT_CONFIG,
        model: this.credentials.apiModel,
        messages,
        tools: [{ type: 'function', function: createWebSearchAIFunction() }],
        tool_choice: 'required',
      });

      const toolCall = search.choices[0]?.message?.tool_calls?.[0];
      if (toolCall?.type !== 'function' || toolCall.function.name !== 'WebSearch') {
        this.logger.warn('Web search function call expected but not received or invalid.', { choice: search.choices[0] });
        return [];
      }

      const args = JSON.parse(toolCall.function.arguments);

      return await pipe(
        this.searchEnginesService.getDefaultSearchEngineProxy(organizationId),
        TE.chainW(searchEngine => searchEngine.executeQuery({
          query: args.query,
          results: Math.min(args.results ?? 30, 30),
          language: args.language ?? 'en',
        })),
        tryOrThrowTE,
      )();
    }
    catch (error) {
      this.logger.error('Error executing web search:', error);
      return [];
    }
  }
}

type HandleStreamingArgs = {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  tools?: OpenAI.Chat.Completions.ChatCompletionTool[];
  signal?: AbortSignal;
  webSearchResults: SearchEngineResultItem[] | null;
  asyncFunctions: AIProxyAsyncFunction[];
  client: OpenAI;
  apiModel: string;
  config: typeof DEFAULT_CLIENT_CONFIG;
};

async function* handleStreamingAndToolCalls(
  {
    messages,
    tools,
    signal,
    webSearchResults,
    asyncFunctions,
    client,
    apiModel,
    config,
  }: HandleStreamingArgs,
): AsyncIterableIterator<AIProxyStreamChunk> {
  const logger = LoggerService.of('handleStreamingAndToolCalls');

  // Yield web search results first if available
  if (webSearchResults?.length) {
    yield { webSearchResults, asyncFunctionsResults: [] };
  }

  const currentMessages = [...messages];
  const toolChoice = tools ? 'auto' : undefined;

  // --- Stage 1: Initial LLM Call ---
  logger.info('--- Stage 1: Initiating initial stream call ---', { hasTools: !!tools });
  const stream = await client.chat.completions.create(
    {
      ...config,
      stream: true,
      model: apiModel,
      messages: currentMessages,
      ...(tools && { tools }),
      ...(toolChoice && { tool_choice: toolChoice }),
    },
    { signal },
  );

  const accumulatedToolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[] = [];
  let accumulatedContent = '';
  let finishReason: OpenAI.Chat.Completions.ChatCompletionChunk.Choice['finish_reason'] | null = null;

  // Process the first stream
  const streamProcessor = pipe(
    stream as unknown as AsyncIterableIterator<OpenAI.Chat.Completions.ChatCompletionChunk>,
    tapAsyncIterator((chunk: OpenAI.Chat.Completions.ChatCompletionChunk) => {
      if (signal?.aborted) {
        return;
      }

      const choice = chunk.choices[0];
      const delta = choice?.delta;

      finishReason = choice?.finish_reason ?? finishReason;

      if (delta?.content) {
        accumulatedContent += delta.content;
      }

      if (delta?.tool_calls) {
        for (const toolCallChunk of delta.tool_calls) {
          if (toolCallChunk.index >= accumulatedToolCalls.length) {
            accumulatedToolCalls.push({ id: '', type: 'function', function: { name: '', arguments: '' } });
          }

          const currentTool = accumulatedToolCalls[toolCallChunk.index];

          if (toolCallChunk.id) {
            currentTool.id = toolCallChunk.id;
          }

          if (toolCallChunk.function?.name) {
            currentTool.function.name = toolCallChunk.function.name;
          }

          if (toolCallChunk.function?.arguments) {
            currentTool.function.arguments += toolCallChunk.function.arguments;
          }
        }
      }
    }),
    filterMapAsyncIterator((chunk: OpenAI.Chat.Completions.ChatCompletionChunk) => {
      if (signal?.aborted) {
        return null;
      }

      return chunk.choices[0]?.delta?.content;
    }),
  );

  for await (const contentChunk of streamProcessor) {
    yield contentChunk;
  }

  if (signal?.aborted) {
    return;
  }

  logger.info(`--- Stage 1: Finished. Reason: ${finishReason} ---`);

  // --- Stage 2: Tool Execution and Final LLM Call (if needed) ---
  if (finishReason === 'tool_calls' && accumulatedToolCalls.length > 0) {
    logger.info(`--- Stage 2: Executing ${accumulatedToolCalls.length} tool calls. ---`);

    const assistantMessage = createAssistantMessage(accumulatedContent, accumulatedToolCalls);

    if (assistantMessage) {
      currentMessages.push(assistantMessage);
    }

    const { toolResultMessages, functionResults } = await executeToolCallsHelper(accumulatedToolCalls, asyncFunctions);

    if (functionResults.length > 0) {
      yield {
        webSearchResults: [],
        asyncFunctionsResults: functionResults,
      };
    }

    currentMessages.push(...toolResultMessages);
    logger.info('--- Stage 2: Initiating final stream call after tool execution. ---');

    const finalStream = await client.chat.completions.create(
      {
        ...config,
        stream: true,
        model: apiModel,
        messages: currentMessages,
      },
      { signal },
    );

    for await (const chunk of finalStream) {
      if (signal?.aborted) {
        return;
      }

      if (chunk.choices[0]?.delta?.content) {
        yield chunk.choices[0].delta.content;
      }
    }

    logger.info('--- Stage 2: Finished. ---');
  }
}

function createAssistantMessage(
  content: string | null,
  toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
): OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam | null {
  const message: OpenAI.Chat.Completions.ChatCompletionAssistantMessageParam = {
    role: 'assistant',
    content: content || null,
  };

  if (toolCalls.length > 0) {
    message.tool_calls = toolCalls;
  }

  if (message.content || (message.tool_calls && message.tool_calls.length > 0)) {
    return message;
  }

  return null;
}

async function executeToolCallsHelper(
  toolCalls: OpenAI.Chat.Completions.ChatCompletionMessageToolCall[],
  asyncFunctions: AIProxyAsyncFunction[],
) {
  const logger = LoggerService.of('executeToolCallsHelper');
  const toolResultMessages: OpenAI.Chat.Completions.ChatCompletionToolMessageParam[] = [];
  const functionResults: AIProxyAsyncFunctionResult[] = [];

  for await (const toolCall of toolCalls) {
    if (toolCall.type !== 'function') {
      continue;
    }

    const { name, arguments: argsString } = toolCall.function;

    if (isDangerousObjectKey(name)) {
      logger.warn(`Skipping potentially dangerous tool call: ${name}`);
      toolResultMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify({ error: 'Skipped potentially dangerous function name.' }),
      });
      continue;
    }

    const asyncFunction = asyncFunctions.find(fn => fn.definition.name === name);

    if (asyncFunction) {
      try {
        logger.info(`Executing tool call: ${name} with args: ${argsString}`);

        const args = JSON.parse(argsString || '{}');
        const result = await asyncFunction.executor(args);
        const resultString = JSON.stringify(result);

        functionResults.push({
          externalApiId: asyncFunction.externalApi.id,
          functionName: name,
          args,
          result,
        });

        toolResultMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: resultString,
        });
      }
      catch (error: any) {
        logger.error(`Error executing async function ${name}:`, error);

        const errorMsg = JSON.stringify({ error: `Function execution failed: ${error.message || 'Unknown error'}` });

        toolResultMessages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: errorMsg,
        });

        functionResults.push({
          externalApiId: asyncFunction.externalApi.id,
          functionName: name,
          args: JSON.parse(argsString || '{}'),
          result: { error: `Function execution failed: ${error.message || 'Unknown error'}` },
        });
      }
    }
    else {
      logger.warn(`Tool call received for unknown function: ${name}`);
      toolResultMessages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify({ error: `Function '${name}' not found.` }),
      });
    }
  }

  return { toolResultMessages, functionResults };
}

function determineOpenAIInstructorMode(model: string) {
  if (model.includes('gpt-4')) {
    return 'FUNCTIONS';
  }

  if (model.includes('gpt-3.5-turbo') && !model.includes('0301')) {
    return 'FUNCTIONS';
  }

  return 'JSON';
}

function normalizeAIProxyMessageToCompletion(message: string | AIProxyMessage): OpenAI.Chat.Completions.ChatCompletionMessageParam {
  if (typeof message === 'string') {
    message = {
      role: 'user',
      content: message,
    };
  }

  const { role, content } = message;

  if (typeof content === 'string') {
    return {
      role,
      content,
    };
  }

  return {
    role: 'user',
    content: [
      {
        type: 'text',
        text: content.text,
      },
      {
        type: 'image_url',
        image_url: {
          url: content.imageUrl,
          detail: 'auto',
        },
      },
    ],
  };
}

function normalizeSdkMessagesToCompletion(messages: SdkMessageT[]): Array<OpenAI.Chat.Completions.ChatCompletionMessageParam> {
  return messages.map(({ content, role }) => ({
    role,
    content,
  }));
}
