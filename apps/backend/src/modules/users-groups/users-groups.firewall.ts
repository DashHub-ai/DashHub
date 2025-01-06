import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type {
  SdkCreateUsersGroupInputT,
  SdkJwtTokenT,
  SdkSearchUsersGroupsInputT,
  SdkUpdateUsersGroupInputT,
} from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId, TableRowWithId } from '../database';
import type { PermissionsService } from '../permissions';
import type { UsersGroupsService } from './users-groups.service';

export class UsersGroupsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly usersGroupsService: UsersGroupsService,
    private readonly permissionsService: Readonly<PermissionsService>,
  ) {
    super(jwt);
  }

  update = (attrs: SdkUpdateUsersGroupInputT & TableRowWithId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.usersGroupsService.get(attrs.id),
    }),
    TE.chainW(() => this.usersGroupsService.update(attrs)),
  );

  create = (dto: SdkCreateUsersGroupInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationCreatorScope(dto),
    TE.fromEither,
    TE.chainW(mappedDto => this.usersGroupsService.create({
      ...mappedDto,
      creator: this.userIdRow,
    })),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  search = (dto: SdkSearchUsersGroupsInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters(dto),
    TE.fromEither,
    TE.chainW(this.usersGroupsService.search),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  unarchive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.usersGroupsService.get(id),
    }),
    TE.chainW(() => this.usersGroupsService.unarchive(id)),
  );

  archive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.usersGroupsService.get(id),
    }),
    TE.chainW(() => this.usersGroupsService.archive(id)),
  );
}
