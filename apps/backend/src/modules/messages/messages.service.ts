import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateMessageInputT, SdkJwtTokenT } from '@llm/sdk';

import type { TableRowWithId, TableRowWithUuid } from '../database';

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
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new MessagesFirewall(jwt, this);

  search = this.esSearchRepo.search;

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
}
