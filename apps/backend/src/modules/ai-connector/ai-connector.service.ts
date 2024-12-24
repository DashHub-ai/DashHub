import Instructor from '@instructor-ai/instructor';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { OpenAI } from 'openai';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import type {
  SdkCreateMessageInputT,
  SdkMessageT,
  SdkSearchAIModelItemT,
  SdkTableRowWithIdT,
} from '@llm/sdk';

import { rejectFalsyItems } from '@llm/commons';

import { AIModelsService } from '../ai-models';
import { OpenAIConnectionCreatorError } from './ai-connector.errors';

@injectable()
export class AIConnectorService {
  constructor(
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
  ) {}

  executeEmbeddingPrompt = (
    {
      aiModel,
      input,
    }: {
      aiModel: SdkTableRowWithIdT;
      input: string;
    },
  ) => pipe(
    this.aiModelsService.get(aiModel.id),
    TE.chainW(({ credentials: { apiKey, apiModel } }) => {
      const ai = new OpenAI({
        apiKey,
      });

      return OpenAIConnectionCreatorError.tryCatch(
        async () => {
          const result = await ai.embeddings.create({
            input,
            model: apiModel,
          });

          return result.data[0].embedding;
        },
      );
    }),
  );

  executeStreamPrompt = (
    {
      aiModel,
      history,
      context,
      message,
      signal,
    }: {
      aiModel: SdkTableRowWithIdT;
      history: SdkMessageT[];
      message?: SdkCreateMessageInputT;
      signal?: AbortSignal;
      context?: string;
    },
  ) => pipe(
    this.aiModelsService.get(aiModel.id),
    TE.chainW(({ credentials }) => {
      const ai = new OpenAI({
        apiKey: credentials.apiKey,
      });

      return OpenAIConnectionCreatorError.tryCatch(
        () => ai.chat.completions.create({
          stream: true,
          model: credentials.apiModel,
          messages: rejectFalsyItems([
            !!context && {
              role: 'system',
              content: context,
            },
            ...this.normalizeMessagesToCompletion(history),
            !!message?.content && {
              role: 'user',
              content: message.content,
            },
          ]),
        }, { signal }),
      );
    }),
  );

  executePrompt = (
    {
      aiModel,
      history = [],
      message,
    }: {
      aiModel: SdkTableRowWithIdT | SdkSearchAIModelItemT;
      history?: SdkMessageT[];
      message: string | OpenAI.Chat.Completions.ChatCompletionMessageParam;
    },
  ) => pipe(
    'credentials' in aiModel
      ? TE.of(aiModel)
      : this.aiModelsService.get(aiModel.id),
    TE.chainW(({ credentials }) => {
      const ai = new OpenAI({
        apiKey: credentials.apiKey,
      });

      const client = Instructor({
        client: ai,
        mode: this.determineInstructorMode(credentials.apiModel),
      });

      return OpenAIConnectionCreatorError.tryCatch(
        async () => {
          const result = await client.chat.completions.create({
            model: credentials.apiModel,
            messages: [
              ...this.normalizeMessagesToCompletion(history),
              typeof message === 'string'
                ? {
                    role: 'user',
                    content: message,
                  }
                : message,
            ],
          });

          return result.choices[0].message.content;
        },
      );
    }),
  );

  executeInstructedPrompt = <Z extends z.AnyZodObject>(
    {
      aiModel,
      history = [],
      message,
      schema,
    }: {
      aiModel: SdkTableRowWithIdT | SdkSearchAIModelItemT;
      history?: SdkMessageT[];
      message: string;
      schema: Z;
    },
  ) => pipe(
    'credentials' in aiModel
      ? TE.of(aiModel)
      : this.aiModelsService.get(aiModel.id),
    TE.chainW(({ credentials }) => {
      const ai = new OpenAI({
        apiKey: credentials.apiKey,
      });

      const client = Instructor({
        client: ai,
        mode: this.determineInstructorMode(credentials.apiModel),
      });

      return OpenAIConnectionCreatorError.tryCatch(
        async () => client.chat.completions.create({
          model: credentials.apiModel,
          messages: [
            ...this.normalizeMessagesToCompletion(history),
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
    }),
  );

  private determineInstructorMode = (model: string): 'JSON' | 'JSON_SCHEMA' | 'FUNCTIONS' | 'TOOLS' => {
    // GPT-4 models support function calling
    if (model.includes('gpt-4')) {
      return 'FUNCTIONS';
    }

    // GPT-3.5-turbo models after June 13th, 2023 support function calling
    if (model.includes('gpt-3.5-turbo') && !model.includes('0301')) {
      return 'FUNCTIONS';
    }

    // Claude models work best with JSON mode
    if (model.includes('claude')) {
      return 'JSON';
    }

    // Default to JSON mode as it's most widely supported
    return 'JSON';
  };

  private normalizeMessagesToCompletion = (messages: SdkMessageT[]) =>
    messages.map(({ content, role }): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
      role,
      content,
    }));
}
