import type { ChatCompletionChunk } from 'openai/resources/index.mjs';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateMessageInputT,
  SdkJwtTokenT,
  SdkRequestAIReplyInputT,
} from '@llm/sdk';

import { findItemIndexById, mapAsyncIterator, tryOrThrowTE } from '@llm/commons';

import type { TableId, TableRowWithId, TableRowWithUuid, TableUuid } from '../database';

import { AIConnectorService } from '../ai-connector';
import { WithAuthFirewall } from '../auth';
import { MessagesEsIndexRepo, MessagesEsSearchRepo } from './elasticsearch';
import { MessagesFirewall } from './messages.firewall';
import { MessagesRepo } from './messages.repo';

export type CreateUserMessageInputT = {
  chat: TableRowWithUuid;
  message: SdkCreateMessageInputT;
  creator: TableRowWithId;
};

@injectable()
export class MessagesService implements WithAuthFirewall<MessagesFirewall> {
  constructor(
    @inject(MessagesRepo) private readonly repo: MessagesRepo,
    @inject(MessagesEsSearchRepo) private readonly esSearchRepo: MessagesEsSearchRepo,
    @inject(MessagesEsIndexRepo) private readonly esIndexRepo: MessagesEsIndexRepo,
    @inject(AIConnectorService) private readonly aiConnectorService: AIConnectorService,
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new MessagesFirewall(jwt, this);

  search = this.esSearchRepo.search;

  searchByChatId = this.esSearchRepo.searchByChatId;

  createUserMessage = ({ creator, chat, message }: CreateUserMessageInputT) =>
    pipe(
      this.repo.create({
        value: {
          chatId: chat.id,
          content: message.content,
          metadata: {},
          originalMessageId: null,
          aiModelId: null,
          creatorUserId: creator.id,
          repeatCount: 0,
          role: 'user',
        },
      }),
      TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
    );

  aiReply = (
    { id, aiModel }: TableRowWithUuid & SdkRequestAIReplyInputT,
    signal?: AbortSignal,
  ) => pipe(
    TE.Do,
    TE.bind('message', () => this.repo.findById({ id })),
    TE.bindW('history', ({ message }) => pipe(
      this.searchByChatId(message.chatId),
      TE.map(({ items }) => {
        const historyIndex = findItemIndexById(message.id)(items);

        return items.slice(historyIndex + 1).toReversed();
      }),
    )),
    TE.chainW(({ message, history }) =>
      pipe(
        this.aiConnectorService.executePrompt(
          {
            signal,
            aiModel,
            history,
            message: {
              content: message.content,
            },
          },
        ),
        TE.map(
          stream => pipe(
            stream as unknown as AsyncIterableIterator<ChatCompletionChunk>,
            mapAsyncIterator(chunk => chunk.choices[0]?.delta?.content ?? ''),
          ),
        ),
        TE.map(stream => this.createAIResponseMessage(
          {
            repliedMessageId: message.id,
            originalMessageId: null,
            chatId: message.chatId,
            aiModelId: aiModel.id,
            stream,
          },
          signal,
        )),
      ),
    ),
  );

  aiRefresh = (
    { id, aiModel }: TableRowWithUuid & SdkRequestAIReplyInputT,
    signal?: AbortSignal,
  ) => pipe(
    TE.Do,
    TE.bind('refreshedMessage', () => this.repo.findById({ id })),
    TE.bindW('history', ({ refreshedMessage }) => pipe(
      this.searchByChatId(refreshedMessage.chatId),
      TE.map(({ items }) => {
        const historyIndex = findItemIndexById(refreshedMessage.id)(items);

        return items.slice(historyIndex).toReversed();
      }),
    )),
    TE.chainW(({ refreshedMessage, history }) =>
      pipe(
        this.aiConnectorService.executePrompt(
          {
            signal,
            aiModel,
            history,
          },
        ),
        TE.map(
          stream => pipe(
            stream as unknown as AsyncIterableIterator<ChatCompletionChunk>,
            mapAsyncIterator(chunk => chunk.choices[0]?.delta?.content ?? ''),
          ),
        ),
        TE.map(stream => this.createAIResponseMessage(
          {
            repliedMessageId: refreshedMessage.repliedMessageId,
            originalMessageId: refreshedMessage.id,
            chatId: refreshedMessage.chatId,
            aiModelId: aiModel.id,
            stream,
          },
          signal,
        )),
      ),
    ),
  );

  private async *createAIResponseMessage(
    {
      chatId,
      aiModelId,
      stream,
      repliedMessageId,
      originalMessageId,
    }: {
      repliedMessageId: TableUuid | null;
      originalMessageId: TableUuid | null;
      chatId: TableUuid;
      aiModelId: TableId;
      stream: AsyncIterableIterator<string>;
    },
    signal?: AbortSignal,
  ) {
    let content = '';

    try {
      for await (const item of stream) {
        if (signal?.aborted) {
          return;
        }

        content += item;
        yield item;
      }

      const countRepeatsTask = (
        originalMessageId
          ? this.repo.count({
            where: [
              ['originalMessageId', '=', originalMessageId],
            ],
          })
          : TE.of(0)
      );

      await pipe(
        countRepeatsTask,
        TE.chain(repeatsCount => this.repo.create({
          value: {
            chatId,
            aiModelId,
            content,
            metadata: {},
            repliedMessageId,
            originalMessageId,
            creatorUserId: null,
            repeatCount: repeatsCount,
            role: 'assistant',
          },
        })),
        TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
        tryOrThrowTE,
      )();

      if (!signal?.aborted) {
        yield '';
      }
    }
    catch (error) {
      if (!signal?.aborted) {
        throw error;
      }
    }
  };
}
