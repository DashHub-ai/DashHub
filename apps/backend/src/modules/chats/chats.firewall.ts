import { flow } from 'fp-ts/lib/function';

import { ofSdkUnauthorizedErrorTE, type SdkCreateChatInputT, type SdkJwtTokenT } from '@llm/sdk';
import { AuthFirewallService } from '~/modules/auth/firewall';

import type { ChatsService } from './chats.service';

export class ChatsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly chatsService: ChatsService,
  ) {
    super(jwt);
  }

  // TODO: Add belongs checks
  unarchive = flow(
    this.chatsService.archive,
    this.tryTEIfUser.is.root,
  );

  // TODO: Add belongs checks
  archive = flow(
    this.chatsService.archive,
    this.tryTEIfUser.is.root,
  );

  create = ({ creator, organization, ...chat }: SdkCreateChatInputT) => {
    const { jwt } = this;

    switch (jwt.role) {
      case 'root':
        if (!creator || !organization) {
          return ofSdkUnauthorizedErrorTE();
        }

        return this.chatsService.create({
          ...chat,
          creator,
          organization,
        });

      case 'user':
        return this.chatsService.create({
          ...chat,
          creator: this.userIdRow,
          organization: jwt.organization,
        });

      default: {
        const _: never = jwt;

        return ofSdkUnauthorizedErrorTE();
      }
    }
  };
}
