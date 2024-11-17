import { inject, injectable } from 'tsyringe';

import type { SdkCreateMessageInputT, SdkJwtTokenT } from '@llm/sdk';

import type { TableRowWithId, TableRowWithUuid } from '../database';

import { WithAuthFirewall } from '../auth';
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
  ) {}

  asUser = (jwt: SdkJwtTokenT) => new MessagesFirewall(jwt, this);

  createMessage = ({ creator, chat, message }: CreateInternalMessageInputT) =>
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
    });
}
