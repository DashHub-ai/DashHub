import { flow, pipe } from 'fp-ts/lib/function';

import type { SdkCreateUsersGroupInputT, SdkJwtTokenT } from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { UsersGroupsService } from './users-groups.service';

export class UsersGroupsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly usersGroupsService: UsersGroupsService,
  ) {
    super(jwt);
  }

  unarchive = flow(
    this.usersGroupsService.unarchive,
    this.tryTEIfUser.is.root,
  );

  archive = flow(
    this.usersGroupsService.archive,
    this.tryTEIfUser.is.root,
  );

  update = flow(
    this.usersGroupsService.update,
    this.tryTEIfUser.is.root,
  );

  create = (dto: SdkCreateUsersGroupInputT) => pipe(
    this.usersGroupsService.create({
      ...dto,
      creator: this.userIdRow,
    }),
    this.tryTEIfUser.is.root,
  );

  search = flow(
    this.usersGroupsService.search,
    this.tryTEIfUser.is.root,
  );
}
