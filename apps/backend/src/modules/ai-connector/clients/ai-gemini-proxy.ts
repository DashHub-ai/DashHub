import type { z } from 'zod';

import { Buffer } from 'node:buffer';

import {
  type Content,
  type GenerativeModel,
  GoogleGenerativeAI,
} from '@google/generative-ai';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { SdkAIModelT, SdkMessageT } from '@llm/sdk';
import type { SearchEnginesService } from '~/modules/search-engines';

import { isDataUrl } from '@llm/commons';

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

  executeStreamPrompt({ history, context, message, signal }: AIProxyStreamPromptAttrs) {
    return pipe(
      AIConnectionCreatorError.tryCatch(
        async () => {
          const systemInstruction = [
            collectSystemMessages(history),
            context,
          ]
            .filter(Boolean)
            .join('\n\n\n');

          const chat = this.client.startChat({
            generationConfig: DEFAULT_CLIENT_CONFIG,
            history: normalizeGeminiMessagesToCompletion(history),
            systemInstruction,
          });

          const result = await chat.sendMessageStream(
            message?.content || '',
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
          systemInstruction: collectSystemMessages(history),
          history: normalizeGeminiMessagesToCompletion(history),
          generationConfig: DEFAULT_CLIENT_CONFIG,
        });

        const result = await chat.sendMessage(
          [
            `Return response in JSON format following this schema: ${schema.toString()}.',
            'Message: ${message}`,
          ].join('\n'),
        );

        const jsonResponse = result.response.text();

        return JSON.parse(jsonResponse);
      },
    );
  }

  executePrompt({ history = [], message }: AIProxyPromptAttrs) {
    return AIConnectionCreatorError.tryCatch(
      async () => {
        const chat = this.client.startChat({
          systemInstruction: collectSystemMessages(history),
          history: normalizeGeminiMessagesToCompletion(history),
          generationConfig: DEFAULT_CLIENT_CONFIG,
        });

        const content = typeof message === 'string' ? message : message.content;

        // Multimedia response
        if (typeof content !== 'string') {
          const imageResponse = isDataUrl(content.imageUrl)
            ? await fetch(content.imageUrl)
              .then(response => response.arrayBuffer())
              .then(buffer => Buffer.from(buffer).toString('base64'))
            : content.imageUrl;

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

function collectSystemMessages(messages: SdkMessageT[]): string {
  return messages
    .filter(({ role }) => role === 'system')
    .map(({ content }) => content)
    .join('\n');
}

function normalizeGeminiMessagesToCompletion(messages: SdkMessageT[]): Array<Content> {
  return messages
    .filter(({ role }) => role !== 'system')
    .map(({ content, role }) => ({
      role: role === 'assistant' ? 'model' : role,
      parts: [{ text: content }],
    }));
}
