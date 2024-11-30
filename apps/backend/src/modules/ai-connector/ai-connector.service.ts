import Instructor from '@instructor-ai/instructor';
import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { OpenAI } from 'openai';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import type {
  SdkCreateMessageInputT,
  SdkMessageT,
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

  executeStreamPrompt = (
    {
      aiModel,
      history,
      message,
      signal,
    }: {
      aiModel: SdkTableRowWithIdT;
      history: SdkMessageT[];
      message?: SdkCreateMessageInputT;
      signal?: AbortSignal;
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

  executeInstructedPrompt = <Z extends z.AnyZodObject>(
    {
      aiModel,
      history,
      message,
      schema,
    }: {
      aiModel: SdkTableRowWithIdT;
      history: SdkMessageT[];
      message: string;
      schema: Z;
    },
  ) => pipe(
    this.aiModelsService.get(aiModel.id),
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
