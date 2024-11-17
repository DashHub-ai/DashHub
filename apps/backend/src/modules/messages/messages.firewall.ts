import { flow } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { MessagesService } from './messages.service';

import { AuthFirewallService } from '../auth';

export class MessagesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly messagesService: MessagesService,
  ) {
    super(jwt);
  }

  // TODO: Add belongs checks
  createMessage = flow(
    this.messagesService.createMessage,
    this.tryTEIfUser.is.root,
  );
}
