import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateMessageInputT,
  SdkJwtTokenT,
  SdkRequestAIReplyInputT,
} from '@llm/sdk';

import { findItemIndexById } from '@llm/commons';

import type { TableRowWithId, TableRowWithUuid } from '../database';

import { AIConnectorService } from '../ai-connector';
import { WithAuthFirewall } from '../auth';
import { MessagesEsIndexRepo, MessagesEsSearchRepo } from './elasticsearch';
import { MessagesFirewall } from './messages.firewall';
import { MessagesRepo } from './messages.repo';

export type CreateInternalMessageInputT = {
  creator: TableRowWithId;
  chat: TableRowWithUuid;
  message: SdkCreateMessageInputT;
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

  create = ({ creator, chat, message }: CreateInternalMessageInputT) =>
    pipe(
      this.repo.create({
        value: {
          chatId: chat.id,
          content: message.content,
          metadata: {},
          originalMessageId: null,
          creatorUserId: creator.id,
          repeatCount: 0,
          role: 'user',
        },
      }),
      TE.tap(({ id }) => this.esIndexRepo.findAndIndexDocumentById(id)),
    );

  aiReply = ({ id, aiModel }: TableRowWithUuid & SdkRequestAIReplyInputT) => pipe(
    TE.Do,
    TE.bind('message', () => this.repo.findById({ id })),
    TE.bindW('history', ({ message }) => pipe(
      this.searchByChatId(message.chatId),
      TE.map(({ items }) => {
        const historyIndex = findItemIndexById(message.id)(items);

        // Exclude the current message from the history.
        return items.slice(0, historyIndex);
      }),
    )),
    TE.chainW(({ message, history }) =>
      this.aiConnectorService.executePrompt({
        aiModel,
        history,
        message: {
          content: message.content,
        },
      }),
    ),
  );
}
