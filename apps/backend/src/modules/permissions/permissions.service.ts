import { either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  ofSdkUnauthorizedErrorE,
  type SdkPermissionAccessLevelT,
  type SdkTableRowWithPermissionsT,
  type SdkUnauthorizedError,
} from '@llm/sdk';

import type { DatabaseError, TableId } from '../database';

import { UsersGroupsRepo } from '../users-groups';
import { PermissionsRepo } from './permissions.repo';
import {
  checkPermissionsMatch,
  type UserAccessPermissionsDescriptor,
  type WithPermissionsInternalFilters,
} from './record-protection';

@injectable()
export class PermissionsService {
  constructor(
    @inject(PermissionsRepo) private readonly repo: PermissionsRepo,
    @inject(UsersGroupsRepo) private readonly usersGroupsRepo: UsersGroupsRepo,
  ) {}

  upsert = this.repo.upsert;

  chainValidateResultOrRaiseUnauthorized = (attrs: PermissionsFiltersGetterAttrs) =>
    <E, R extends SdkTableRowWithPermissionsT>(result: TE.TaskEither<E, R>) => pipe(
      result,
      TE.chainW((data: R) =>
        this.validateResultOrRaiseUnauthorized(attrs)(data),
      ),
    );

  validateResultOrRaiseUnauthorized = (attrs: PermissionsFiltersGetterAttrs) =>
    <E, R extends SdkTableRowWithPermissionsT>(result: R): TE.TaskEither<E | SdkUnauthorizedError | DatabaseError, R> => pipe(
      this.finUserAccessPermissionsDescriptor(attrs),
      TE.chainEitherKW((descriptor) => {
        if (!checkPermissionsMatch(descriptor, result)) {
          return ofSdkUnauthorizedErrorE();
        }

        return E.right(result);
      }),
    );

  enforceSatisfyPermissionsFilters = (attrs: PermissionsFiltersGetterAttrs) => <F>(filters: F) => pipe(
    this.finUserAccessPermissionsDescriptor(attrs),
    TE.map((satisfyPermissions): WithPermissionsInternalFilters<F> => ({
      ...filters,
      satisfyPermissions,
    })),
  );

  private finUserAccessPermissionsDescriptor = ({ accessLevel, userId }: PermissionsFiltersGetterAttrs) => pipe(
    this.usersGroupsRepo.getAllUsersGroupsIds({ userId }),
    TE.map((groupsIds): UserAccessPermissionsDescriptor => ({
      accessLevel,
      groupsIds,
      userId,
    })),
  );
}

type PermissionsFiltersGetterAttrs = {
  accessLevel: SdkPermissionAccessLevelT;
  userId: TableId;
};
