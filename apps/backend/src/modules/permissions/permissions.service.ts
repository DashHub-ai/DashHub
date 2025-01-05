import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkPermissionAccessLevelT } from '@llm/sdk';

import type { TableId } from '../database';
import type { WithPermissionsInternalFilters } from './record-protection';

import { UsersGroupsRepo } from '../users-groups';
import { PermissionsRepo } from './permissions.repo';

@injectable()
export class PermissionsService {
  constructor(
    @inject(PermissionsRepo) private readonly repo: PermissionsRepo,
    @inject(UsersGroupsRepo) private readonly usersGroupsRepo: UsersGroupsRepo,
  ) {}

  upsert = this.repo.upsert;

  enforceSatisfyPermissionsFilters = (
    {
      accessLevel,
      userId,
    }: {
      accessLevel: SdkPermissionAccessLevelT;
      userId: TableId;
    },
  ) => <F>(filters: F) => pipe(
    this.usersGroupsRepo.getAllUsersGroupsIds({ userId }),
    TE.map((groupsIds): WithPermissionsInternalFilters<F> => ({
      ...filters,
      satisfyPermissions: {
        accessLevel,
        groupsIds,
        userId,
      },
    })),
  );
}
