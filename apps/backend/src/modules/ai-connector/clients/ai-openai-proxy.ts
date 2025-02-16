import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import type { z } from 'zod';

import Instructor, { type InstructorClient } from '@instructor-ai/instructor';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { OpenAI } from 'openai';

import type { SdkAIModelT, SdkMessageT } from '@llm/sdk';
import type { SearchEnginesService } from '~/modules/search-engines';
import type { SearchEngineResultItem } from '~/modules/search-engines/clients/search-engine-proxy';

import { flatMapAsyncIterator, rejectFalsyItems, tryOrThrowTE } from '@llm/commons';
import { createWebSearchFunctionTool, createWebSearchResultsPrompt } from '~/modules/prompts';

import { AIConnectionCreatorError } from '../ai-connector.errors';
import {
  AIProxy,
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
    }: AIProxyStreamPromptAttrs,
  ) {
    const { webSearch } = message;
    const messages = rejectFalsyItems([
      !!context && {
        role: 'system',
        content: context,
      } as const,

      ...normalizeSdkMessagesToCompletion(history),

      !!message.content && {
        role: 'user',
        content: message.content,
      } as const,
    ]);

    const executeSearchWeb = async () => {
      const search = await this.client.chat.completions.create(
        {
          ...DEFAULT_CLIENT_CONFIG,
          model: this.credentials.apiModel,
          tools: [
            createWebSearchFunctionTool(),
          ],
          tool_choice: 'required',
          messages,
        },
      );

      const functionCall = search.choices[0]?.message?.tool_calls?.[0]?.function;
      if (!functionCall || functionCall.name !== 'WebSearch') {
        return [];
      }

      const args = JSON.parse(functionCall.arguments);
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
          let webSearchResults: SearchEngineResultItem[] | null = null;

          if (webSearch) {
            webSearchResults = await executeSearchWeb();
            messages.push({
              role: 'system',
              content: createWebSearchResultsPrompt(webSearchResults),
            });
          }

          const stream = await this.client.chat.completions.create(
            {
              ...DEFAULT_CLIENT_CONFIG,
              stream: true,
              model: this.credentials.apiModel,
              messages,
            },
            { signal },
          );

          return {
            stream,
            webSearchResults,
          };
        },
      ),
      TE.map(
        ({ stream, webSearchResults }) => pipe(
          stream as unknown as AsyncIterableIterator<ChatCompletionChunk>,
          flatMapAsyncIterator((chunk, index): AIProxyStreamChunk[] => {
            const content = chunk.choices[0]?.delta?.content ?? '';

            if (!index && webSearchResults) {
              return [
                { webSearchResults },
                content,
              ];
            }

            return [content];
          }),
        ),
      ),
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
