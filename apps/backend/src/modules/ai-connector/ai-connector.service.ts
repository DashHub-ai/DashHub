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
        mode: 'TOOLS',
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

  private normalizeMessagesToCompletion = (messages: SdkMessageT[]) =>
    messages.map(({ content, role }): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
      role,
      content,
    }));
}
