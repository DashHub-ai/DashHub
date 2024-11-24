import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { OpenAI } from 'openai';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateMessageInputT,
  SdkMessageT,
  SdkTableRowWithIdT,
} from '@llm/sdk';

import { AIModelsService } from '../ai-models';
import { OpenAIConnectionCreatorError } from './ai-connector.errors';

type ExecutePromptAttrs = {
  aiModel: SdkTableRowWithIdT;
  history: SdkMessageT[];
  message: SdkCreateMessageInputT;
};

@injectable()
export class AIConnectorService {
  constructor(
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
  ) {}

  executePrompt = (
    {
      aiModel,
      history,
      message,
    }: ExecutePromptAttrs,
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
          messages: [
            ...this.normalizeMessagesToCompletion(history),
            {
              role: 'user',
              content: message.content,
            },
          ],
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
