import { flow, pipe } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { CreateInternalMessageInputT, MessagesService } from './messages.service';

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
  );

  // TODO: Add belongs checks
  create = (dto: Omit<CreateInternalMessageInputT, 'creator'>) =>
    pipe(
      this.messagesService.create({
        ...dto,
        creator: this.userIdRow,
      }),
      this.tryTEIfUser.is.root,
    );
}
