import { inject, injectable } from 'tsyringe';

import type { SdkJwtTokenT } from '@llm/sdk';

import type { WithAuthFirewall } from '../auth';

import { UsersGroupsRepo } from '../users-groups';
import { PermissionsFirewall } from './permissions.firewall';
import { PermissionsRepo } from './permissions.repo';

@injectable()
export class PermissionsService implements WithAuthFirewall<PermissionsFirewall> {
  constructor(
    @inject(PermissionsRepo) private readonly repo: PermissionsRepo,
    @inject(UsersGroupsRepo) private readonly usersGroupsRepo: UsersGroupsRepo,
  ) {}

  upsert = this.repo.upsert;

  asUser = (jwt: SdkJwtTokenT) => new PermissionsFirewall(jwt, this.usersGroupsRepo);
}
