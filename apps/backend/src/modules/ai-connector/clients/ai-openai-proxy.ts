import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import type { z } from 'zod';

import Instructor, { type InstructorClient } from '@instructor-ai/instructor';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { OpenAI } from 'openai';

import type { SdkAIModelT, SdkMessageT } from '@llm/sdk';

import { mapAsyncIterator, rejectFalsyItems } from '@llm/commons';

import { AIConnectionCreatorError } from '../ai-connector.errors';
import {
  AIProxy,
  type AIProxyInstructedAttrs,
  type AIProxyMessage,
  type AIProxyPromptAttrs,
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

  constructor(aiModel: SdkAIModelT) {
    super(aiModel);

    const { apiKey, apiModel } = this.credentials;

    this.client = new OpenAI({ apiKey });
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

  executeStreamPrompt({ history, context, message, signal }: AIProxyStreamPromptAttrs) {
    return pipe(
      AIConnectionCreatorError.tryCatch(
        () => this.client.chat.completions.create({
          ...DEFAULT_CLIENT_CONFIG,
          stream: true,
          model: this.credentials.apiModel,
          messages: rejectFalsyItems([
            !!context && {
              role: 'system',
              content: context,
            },
            ...normalizeOpenAIMessagesToCompletion(history),
            !!message?.content && {
              role: 'user',
              content: message.content,
            },
          ]),
        }, { signal }),
      ),
      TE.map(
        stream => pipe(
          stream as unknown as AsyncIterableIterator<ChatCompletionChunk>,
          mapAsyncIterator(chunk => chunk.choices[0]?.delta?.content ?? ''),
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
          ...normalizeOpenAIMessagesToCompletion(history),
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
            ...normalizeOpenAIMessagesToCompletion(history),
            typeof message === 'string'
              ? {
                  role: 'user',
                  content: message,
                }
              : {
                  role: message.role,
                  content: message.content,
                },
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

function normalizeOpenAIMessagesToCompletion(messages: SdkMessageT[]): Array<AIProxyMessage> {
  return messages.map(({ content, role }) => ({
    role,
    content,
  }));
}
