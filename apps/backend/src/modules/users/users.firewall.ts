import { flow } from 'fp-ts/function';

import type { SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { UsersService } from './users.service';

export class UsersFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly usersService: UsersService,
  ) {
    super(jwt);
  }

  create = flow(
    this.usersService.create,
    this.tryTEIfUser.is.root,
  );

  createIfNotExists = flow(
    this.usersService.createIfNotExists,
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.usersService.search,
    this.tryTEIfUser.is.root,
  );
}
