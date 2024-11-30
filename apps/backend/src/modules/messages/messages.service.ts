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
            aiModel,
            history,
            message: {
              content: message.content,
            },
          },
          signal,
        ),
        TE.map(
          stream => pipe(
            stream as unknown as AsyncIterableIterator<ChatCompletionChunk>,
            mapAsyncIterator(chunk => chunk.choices[0]?.delta?.content ?? ''),
          ),
        ),
        TE.map(stream => this.createAIResponseMessage(
          {
            chatId: message.chatId,
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
    }: {
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

      await pipe(
        this.repo.create({
          value: {
            chatId,
            aiModelId,
            content,
            metadata: {},
            originalMessageId: null,
            creatorUserId: null,
            repeatCount: 0,
            role: 'assistant',
          },
        }),
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
