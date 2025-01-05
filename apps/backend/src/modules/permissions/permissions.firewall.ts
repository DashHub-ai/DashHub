import { either as E, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import {
  isSdkRecordWithCreator,
  isSdkRecordWithOrganization,
  isTechOrOwnerUserOrganizationRole,
  ofSdkUnauthorizedErrorE,
  type SdkIdsArrayT,
  type SdkJwtTokenT,
  type SdkPermissionAccessLevelT,
  type SdkTableRowWithPermissionsT,
  type SdkUnauthorizedError,
  type WithSdkCreator,
  type WithSdkOrganization,
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
   * If it's technical or owner access, the check is skipped but the organization id must match.
   *
   * @example
   * get = flow(
   *   this.someService.get,
   *   this.permissionsService.asUser(this.jwt).chainValidateResultOrRaiseUnauthorized,
   * );
   */
  chainValidateResultOrRaiseUnauthorized = <E, R extends SdkTableRowWithPermissionsT>(result: TE.TaskEither<E, R>) => pipe(
    result,
    TE.chainW((data: R): TE.TaskEither<E | SdkUnauthorizedError | DatabaseError, R> => {
      if (this.shouldAllowUsingTechOrOwnerAccess(data)) {
        return TE.right(data);
      }

      // For regular users check ACLs
      return pipe(
        this.findUserAccessPermissionsDescriptor('read'),
        TE.chainEitherKW((descriptor) => {
          if (!checkPermissionsMatch(descriptor, data)) {
            return ofSdkUnauthorizedErrorE();
          }

          return E.right(data);
        }),
      );
    }),
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
      TE.apSW('data', findRecord),
      TE.apSW('descriptor', this.findUserAccessPermissionsDescriptor(accessLevel)),
      TE.chainEitherKW(({ descriptor, data }) => {
        // If creator is the same as the user, skip permission check
        if (isSdkRecordWithCreator(data) && data.creator.id === this.userId) {
          return E.right(data);
        }

        // Check if tech user, if so skip permission check
        if (this.shouldAllowUsingTechOrOwnerAccess(data)) {
          return E.right(data);
        }

        // If not tech user, check ACLs for other users
        if (!checkPermissionsMatch(descriptor, data)) {
          return ofSdkUnauthorizedErrorE();
        }

        return E.right(data);
      }),
    );

  /**
   * Enhances query filters with permission checks to ensure users can only access
   * records they have permissions for.
   *
   * @example
   * search = (filters: SearchInputT) => pipe(
   *   filters,
   *   this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
   *   TE.chainW(this.someService.search),
   * );
   */
  enforcePermissionsFilters = <F>(filters: F) => {
    if (this.jwt.role === 'root') {
      return TE.right(filters);
    }

    return pipe(
      this.findUserAccessPermissionsDescriptor('read'),
      TE.map((satisfyPermissions): WithPermissionsInternalFilters<F> => ({
        ...filters,
        satisfyPermissions,
      })),
    );
  };

  /**
   * Enhances query filters with organization scope checks to ensure users can only access
   * records within their organization.
   *
   * @example
   * search = (filters: SearchInputT) => pipe(
   *   filters,
   *   this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters,
   *   TE.chainW(this.someService.search),
   * );
   */
  enforceOrganizationScopeFilters = <F extends { organizationIds?: SdkIdsArrayT; }>(filters: F): E.Either<SdkUnauthorizedError, F> => {
    switch (this.jwt.role) {
      case 'root':
        return E.right(filters);

      case 'user':
        return E.right({
          ...filters,
          organizationIds: [this.jwt.organization.id],
        });

      default: {
        const _: never = this.jwt;

        return ofSdkUnauthorizedErrorE();
      }
    }
  };

  /**
   * Enforces organization scoped access by enhancing the DTO with proper organization field.
   * For root users, requires organization to be provided in DTO.
   * For regular users, automatically uses their organization from JWT.
   *
   * @example
   * search = (dto: SdkSearchInputT) => pipe(
   *   this.permissionsFirewall.enforceOrganizationScope(dto),
   *   TE.fromEither,
   *   TE.chainW(this.someService.search)
   * );
   */
  enforceOrganizationScope = <DTO extends Partial<WithSdkOrganization>>(
    dto: DTO,
  ): E.Either<SdkUnauthorizedError, DTO & WithSdkOrganization> => {
    const { jwt } = this;

    switch (jwt.role) {
      case 'root':
        if (!dto.organization) {
          return ofSdkUnauthorizedErrorE();
        }

        return E.right({
          ...dto,
          organization: dto.organization,
        });

      case 'user':
        return E.right({
          ...dto,
          organization: jwt.organization,
        });

      default: {
        const _: never = jwt;
        return ofSdkUnauthorizedErrorE();
      }
    }
  };

  /**
   * Enforces organization and creator scoped access by enhancing the DTO.
   * For root users, requires organization to be provided in DTO.
   * For regular users, automatically uses their organization from JWT.
   * Always sets creator to current user if not provided.
   *
   * @example
   * create = (dto: SdkCreateInputT) => pipe(
   *   this.permissionsFirewall.enforceOrganizationCreatorScope(dto),
   *   TE.fromEither,
   *   TE.chainW(this.someService.create)
   * );
   */
  enforceOrganizationCreatorScope = <DTO extends Partial<WithOrganizationCreator>>(
    dto: DTO,
  ): E.Either<SdkUnauthorizedError, DTO & WithOrganizationCreator> => {
    const { jwt } = this;

    switch (jwt.role) {
      case 'root':
        if (!dto.organization) {
          return ofSdkUnauthorizedErrorE();
        }

        return E.right({
          ...dto,
          organization: dto.organization,
          creator: dto.creator ?? this.userIdRow,
        });

      case 'user':
        return E.right({
          ...dto,
          organization: jwt.organization,
          creator: this.userIdRow,
        });

      default: {
        const _: never = jwt;

        return ofSdkUnauthorizedErrorE();
      }
    }
  };

  /**
   * Creates a UserAccessPermissionsDescriptor by finding all group IDs associated with a user.
   *
   * @private
   * @param accessLevel - The access level for the permissions descriptor
   * @returns A TaskEither that resolves to a UserAccessPermissionsDescriptor containing user ID, access level, and associated group IDs
   */
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

  /**
   * Checks if the user should be granted full access based on technical or owner role.
   * This is a shortcut for users with elevated organization roles (tech/owner) to bypass
   * regular permission checks as long as they operate within their organization.
   *
   * @param data - The record to check access for. Must contain organization information.
   * @returns True if the user should be granted full access, false otherwise.
   */
  private shouldAllowUsingTechOrOwnerAccess = <R extends SdkTableRowWithPermissionsT>(data: R): boolean => {
    const { jwt } = this;

    switch (jwt.role) {
      case 'root':
        return true;

      case 'user':
        return (
          isTechOrOwnerUserOrganizationRole(jwt.organization.role)
          && isSdkRecordWithOrganization(data)
          && data.organization.id === jwt.organization.id
        );

      default: {
        const _: never = jwt;
        return false;
      }
    }
  };
}

type WithOrganizationCreator = WithSdkOrganization & WithSdkCreator;
