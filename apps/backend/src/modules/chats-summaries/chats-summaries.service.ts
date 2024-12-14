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

import { AIConnectorService } from '../ai-connector';
import { AIModelsService } from '../ai-models';
import { ChatsEsIndexRepo } from '../chats/elasticsearch';
import { TableRowWithUuid, TableUuid } from '../database';
import { LoggerService } from '../logger';
import { MessagesService } from '../messages';
import { ChatsSummariesRepo } from './chats-summaries.repo';

@injectable()
export class ChatsSummariesService {
  private readonly logger = LoggerService.of('ChatsSummariesService');

  constructor(
    @inject(ChatsSummariesRepo) private readonly repo: ChatsSummariesRepo,
    @inject(ChatsEsIndexRepo) private readonly chatsEsIndexRepo: ChatsEsIndexRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
    @inject(AIModelsService) private readonly aiModelsService: AIModelsService,
    @inject(MessagesService) private readonly messagesService: MessagesService,
  ) {}

  summarizeChats = ({ ids }: { ids: TableUuid[]; }) => pipe(
    ids,
    A.map(id => this.summarizeChatAndUpdate({ id })),
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
            this.summarizeChatAndUpdate({
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

  summarizeChatUsingSchema = <S extends z.AnyZodObject>(
    {
      id,
      schema,
      prompt,
    }: TableRowWithUuid & {
      prompt: string;
      schema: S;
    },
  ) => pipe(
    TE.Do,
    TE.apSW('aiModel', pipe(
      this.chatsEsIndexRepo.getDocument(id),
      TE.chainW(({ organization }) => this.aiModelsService.getDefault(organization.id)),
    )),
    TE.apSW('messages', this.messagesService.searchByChatId(id)),
    TE.chainW(({ messages, aiModel }) => pipe(
      this.aiConnectorService.executeInstructedPrompt({
        aiModel,
        history: messages.items,
        message: prompt,
        schema,
      }),
    )),
  );

  private summarizeChatAndUpdate = ({ id }: TableRowWithUuid) => pipe(
    this.summarizeChatUsingSchema({
      id,
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
      prompt:
          'Summarize this chat, create short title and description in the language of this chat.'
          + 'Keep description compact to store in on the chat. You can use emojis in title and description.'
          + 'Do not summarize the messages about describing app (these ones defined in chat).',
    }),
    TE.orElseW((error) => {
      this.logger.error('Failed to summarize chat', { error });

      return TE.of({
        title: 'Untitled chat',
        description: 'Cannot summarize chat. Please do it manually.',
      });
    }),
    TE.chainW(summarize => this.repo.updateGeneratedSummarizeByChatId(
      {
        chatId: id,
        name: summarize.title,
        content: summarize.description,
      },
    )),
    TE.tap(() => this.chatsEsIndexRepo.findAndIndexDocumentById(id)),
  );
}
