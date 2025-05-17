import { either as E, taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import {
  compareSdkOrganizationUserRoles,
  ofSdkUnauthorizedErrorE,
  type SdkJwtTokenT,
  type SdkSearchUsersInputT,
  type SdkUnauthorizedError,
} from '@dashhub/sdk';
import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId, TableRowWithId } from '../database';
import type { PermissionsService } from '../permissions';
import type {
  InternalCreateUserInputT,
  InternalUpdateUserInputT,
  UsersService,
} from './users.service';

export class UsersFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly usersService: UsersService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  private normalizeCreateUserDto = (dto: InternalCreateUserInputT): E.Either<SdkUnauthorizedError, InternalCreateUserInputT> => {
    const { jwt } = this;

    // Root user can create any user
    if (jwt.role === 'root') {
      return E.right(dto);
    }

    // Non-root users can't create root users
    if (dto.role === 'root') {
      return ofSdkUnauthorizedErrorE();
    }

    // Make sure the organization is enforced
    const dtoWithEnforcedOrganization: InternalCreateUserInputT = {
      ...dto,
      role: 'user',
      organization: {
        ...dto.organization,
        item: {
          ...dto.organization.item,
          id: jwt.organization.id,
        },
      },
    };

    // User of certain type cannot create users of higher type
    if (compareSdkOrganizationUserRoles(jwt.organization.role, dtoWithEnforcedOrganization.organization.role) > 0) {
      return ofSdkUnauthorizedErrorE();
    }

    return E.right(dtoWithEnforcedOrganization);
  };

  private normalizeUpdateUserDto = (dto: InternalUpdateUserInputT & TableRowWithId): E.Either<
    SdkUnauthorizedError,
    InternalUpdateUserInputT & TableRowWithId
  > => {
    const { jwt } = this;

    // Root user can update any user
    if (jwt.role === 'root') {
      return E.right(dto);
    }

    // Non-root users can't update root users or change role to root
    if (dto.role === 'root') {
      return ofSdkUnauthorizedErrorE();
    }

    // User of certain type cannot update users of higher type
    if (compareSdkOrganizationUserRoles(jwt.organization.role, dto.organization.role) > 0) {
      return ofSdkUnauthorizedErrorE();
    }

    return E.right(dto);
  };

  private checkIfCanModifyUser = (userId: TableId) =>
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.usersService.get(userId),
      isOwner: user => user.id === this.jwt.sub,
      refine: (user) => {
        const { jwt } = this;

        // Root can do anything
        if (jwt.role === 'root') {
          return true;
        }

        // Nobody can modify root user (besides root)
        if (user.role === 'root') {
          return false;
        }

        // Tech user can modify only users of lower or equal type
        return compareSdkOrganizationUserRoles(jwt.organization.role, user.organization.role) <= 0;
      },
    });

  create = flow(
    this.normalizeCreateUserDto,
    TE.fromEither,
    TE.chainW(this.usersService.create),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  search = (dto: SdkSearchUsersInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters(dto),
    TE.fromEither,
    TE.chainW(this.usersService.search),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  update = (dto: InternalUpdateUserInputT & TableRowWithId) => pipe(
    this.checkIfCanModifyUser(dto.id),
    TE.chainEitherKW(() => this.normalizeUpdateUserDto(dto)),
    TE.chainW(this.usersService.update),
  );

  unarchive = (id: TableId) => pipe(
    this.checkIfCanModifyUser(id),
    TE.chainW(() => this.usersService.unarchive(id)),
  );

  archive = (id: TableId) => pipe(
    this.checkIfCanModifyUser(id),
    TE.chainW(() => this.usersService.archive(id)),
  );

  readonly me = {
    get: () => this.usersService.get(this.userId),
    update: (dto: InternalUpdateUserInputT) => pipe(
      this.checkIfCanModifyUser(this.userId),
      TE.chainEitherKW(() => this.normalizeUpdateUserDto({
        ...dto,
        id: this.userId,
      })),
      TE.chainW(this.usersService.update),
    ),
  };
}
