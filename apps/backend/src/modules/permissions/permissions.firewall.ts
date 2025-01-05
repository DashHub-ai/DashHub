import { either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import {
  ofSdkUnauthorizedErrorE,
  type SdkJwtTokenT,
  type SdkPermissionAccessLevelT,
  type SdkTableRowWithPermissionsT,
  type SdkUnauthorizedError,
} from '@llm/sdk';

import type { DatabaseError } from '../database';
import type { UsersGroupsRepo } from '../users-groups';

import { AuthFirewallService } from '../auth';
import {
  checkPermissionsMatch,
  type UserAccessPermissionsDescriptor,
  type WithPermissionsInternalFilters,
} from './record-protection';

export class PermissionsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly usersGroupsRepo: UsersGroupsRepo,
  ) {
    super(jwt);
  }

  /**
   * Chains a validation check after a database operation to ensure the user has proper permissions
   * for the retrieved record.
   *
   * @example
   * get = flow(
   *   this.someService.get,
   *   this.permissionsService
   *     .asUser(this.jwt)
   *     .chainValidateResultOrRaiseUnauthorized('read'),
   * );
   */
  chainValidateResultOrRaiseUnauthorized = <E, R extends SdkTableRowWithPermissionsT>(
    accessLevel: SdkPermissionAccessLevelT,
  ) =>
    (result: TE.TaskEither<E, R>) => pipe(
      result,
      TE.chainW((data: R) =>
        this.validateResultOrRaiseUnauthorized<E, R>(accessLevel)(data),
      ),
    );

  /**
   * Enhances query filters with permission checks to ensure users can only access
   * records they have permissions for.
   *
   * @example
   * search = (filters: SearchInputT) => pipe(
   *   filters,
   *   this.permissionsService
   *     .asUser(this.jwt)
   *     .enforceSatisfyPermissionsFilters('read'),
   *   TE.chainW(this.someService.search),
   * );
   */
  enforceSatisfyPermissionsFilters = (
    accessLevel: SdkPermissionAccessLevelT,
  ) => <F>(filters: F) => pipe(
    this.findUserAccessPermissionsDescriptor(accessLevel),
    TE.map((satisfyPermissions): WithPermissionsInternalFilters<F> => ({
      ...filters,
      satisfyPermissions,
    })),
  );

  /**
   * Finds a record and validates if the user has proper permissions to access it.
   * Useful for operations that need to verify permissions before modifying data.
   *
   * @example
   * update = (attrs: UpdateInputT) => pipe(
   *   this.permissionsService
   *     .asUser(this.jwt)
   *     .findRecordAndCheckPermissions({
   *       accessLevel: 'write',
   *       findRecord: this.someService.get(attrs.id),
   *     }),
   *   TE.chainW(() => this.someService.update(attrs)),
   * );
   */
  findRecordAndCheckPermissions = <R extends SdkTableRowWithPermissionsT, E>(
    { findRecord, accessLevel }: {
      accessLevel: SdkPermissionAccessLevelT;
      findRecord: TE.TaskEither<E, R>;
    },
  ): TE.TaskEither<E | DatabaseError | SdkUnauthorizedError, R> =>
    pipe(
      TE.Do,
      TE.apSW('record', findRecord),
      TE.apSW('descriptor', this.findUserAccessPermissionsDescriptor(accessLevel)),
      TE.chainEitherKW(({ descriptor, record }) => {
        if (!checkPermissionsMatch(descriptor, record)) {
          return ofSdkUnauthorizedErrorE();
        }

        return E.right(record);
      }),
    );

  private validateResultOrRaiseUnauthorized = <E, R extends SdkTableRowWithPermissionsT>(
    accessLevel: SdkPermissionAccessLevelT,
  ) =>
    (result: R): TE.TaskEither<E | SdkUnauthorizedError | DatabaseError, R> => pipe(
      this.findUserAccessPermissionsDescriptor(accessLevel),
      TE.chainEitherKW((descriptor) => {
        if (!checkPermissionsMatch(descriptor, result)) {
          return ofSdkUnauthorizedErrorE();
        }

        return E.right(result);
      }),
    );

  private findUserAccessPermissionsDescriptor = (accessLevel: SdkPermissionAccessLevelT) => pipe(
    this.usersGroupsRepo.getAllUsersGroupsIds({
      userId: this.userId,
    }),
    TE.map((groupsIds): UserAccessPermissionsDescriptor => ({
      userId: this.userId,
      accessLevel,
      groupsIds,
    })),
  );
}
