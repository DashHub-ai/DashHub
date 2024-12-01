import { flow, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';

import type { SdkJwtTokenT, SdkSearchMessageItemT } from '@llm/sdk';

import type { AttachAppInputT, CreateUserMessageInputT, MessagesService } from './messages.service';

import { AuthFirewallService } from '../auth';

export class MessagesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly messagesService: MessagesService,
  ) {
    super(jwt);
  }

  // TODO: Add belongs checks
  search = flow(
    this.messagesService.search,
    this.tryTEIfUser.is.root,
    TE.map(({ items, ...attrs }) => ({
      ...attrs,
      items: MessagesFirewall.hideSystemMessages(items),
    })),
  );

  // TODO: Add belongs checks
  searchByChatId = flow(
    this.messagesService.searchByChatId,
    this.tryTEIfUser.is.root,
  );

  // TODO: Add belongs checks
  create = (dto: Omit<CreateUserMessageInputT, 'creator'>) =>
    pipe(
      this.messagesService.createUserMessage({
        ...dto,
        creator: this.userIdRow,
      }),
      this.tryTEIfUser.is.root,
    );

  // TODO: Add belongs checks
  aiReply = flow(
    this.messagesService.aiReply,
    this.tryTEIfUser.is.root,
  );

  // TODO: Add belongs checks
  attachApp = (dto: Omit<AttachAppInputT, 'creator'>) =>
    pipe(
      this.messagesService.attachApp({
        ...dto,
        creator: this.userIdRow,
      }),
      this.tryTEIfUser.is.root,
    );

  private static hideSystemMessages = (messages: Array<SdkSearchMessageItemT>) =>
    messages.map(message => ({
      ...message,
      ...message.role === 'system' && {
        content: 'System message',
      },
    }));
}
