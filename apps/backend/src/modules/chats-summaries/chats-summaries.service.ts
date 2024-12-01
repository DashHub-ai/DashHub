import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';
import { z } from 'zod';

import {
  asyncIteratorToVoidPromise,
  pluck,
  tapAsyncIterator,
  tapTaskEither,
  tapTaskEitherError,
} from '@llm/commons';
import { getLastUsedSdkMessagesAIModel } from '@llm/sdk';

import { AIConnectorService } from '../ai-connector';
import { ChatsEsIndexRepo } from '../chats/elasticsearch';
import { TableRowWithUuid, TableUuid } from '../database';
import { LoggerService } from '../logger';
import { MessagesService } from '../messages';
import { MissingAIModelInChatError } from './chats-summaries.errors';
import { ChatsSummariesRepo } from './chats-summaries.repo';

@injectable()
export class ChatsSummariesService {
  private readonly logger = LoggerService.of('ChatsSummariesService');

  constructor(
    @inject(ChatsSummariesRepo) private readonly repo: ChatsSummariesRepo,
    @inject(ChatsEsIndexRepo) private readonly esIndexRepo: ChatsEsIndexRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(MessagesService) private readonly messagesService: MessagesService,
  ) {}

  summarizeChats = ({ ids }: { ids: TableUuid[]; }) => pipe(
    ids,
    A.map(id => this.summarizeChat({ id })),
    TE.sequenceSeqArray,
  );

  summarizeAllChats = () => pipe(
    this.repo.getTotalChatsToSummarize(),
    tapTaskEither((total) => {
      this.logger.info('Total chats to summarize:', { total });
    }),
    TE.chainW(() => TE.fromTask(() => pipe(
      this.repo.createChatsToSummarizeIterator(),
      tapAsyncIterator(async (chats) => {
        this.logger.info('Summarizing chats', { chats: pluck('chatId')(chats) });

        await pipe(
          chats,
          A.map(summary => pipe(
            this.summarizeChat({
              id: summary.chatId,
            }),
            tapTaskEitherError((error) => {
              this.logger.error('Failed to summarize chat', { error, summary });
            }),
            TE.orElseW(() => TE.right(undefined)),
          )),
          TE.sequenceSeqArray,
        )();
      }),
      asyncIteratorToVoidPromise,
    ))),
  );

  private summarizeChat = ({ id }: TableRowWithUuid) => pipe(
    TE.Do,
    TE.bind('chat', () => this.messagesService.searchByChatId(id)),
    TE.bindW('aiModel', ({ chat }) => {
      const aiModel = getLastUsedSdkMessagesAIModel(chat.items);

      if (aiModel) {
        return TE.right(aiModel);
      }

      return TE.left(new MissingAIModelInChatError(chat));
    }),
    TE.bindW('summarize', ({ chat, aiModel }) => pipe(
      this.aiConnectorService.executeInstructedPrompt({
        aiModel,
        history: chat.items,
        message:
          'Summarize this chat, create short title and description in the language of this chat.'
          + 'Keep description compact to store in on the chat. You can use emojis in title and description.'
          + 'Do not summarize the messages about describing app (these ones defined in chat).',
        schema: z.object({
          title: z.string(),
          description: z.string(),
        }),
      }),
      TE.orElse((error) => {
        this.logger.error('Failed to summarize chat', { error });

        return TE.of({
          title: 'Untitled chat',
          description: 'Cannot summarize chat. Please do it manually.',
        });
      }),
    )),
    TE.chainW(({ summarize }) => this.repo.updateGeneratedSummarizeByChatId(
      {
        chatId: id,
        name: summarize.title,
        content: summarize.description,
      },
    )),
    TE.tap(() => this.esIndexRepo.findAndIndexDocumentById(id)),
  );
}
