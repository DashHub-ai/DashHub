import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import {
  dropSdkPaginationPermissionsKeysIfNotCreator,
  dropSdkPermissionsKeyIfNotCreator,
  type SdkCreateAppInputT,
  type SdkJwtTokenT,
  type SdkUpdateAppInputT,
} from '@llm/sdk';
import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableId, TableRowWithId } from '../database';
import type { PermissionsService } from '../permissions';
import type { AppsService } from './apps.service';
import type { EsAppsInternalFilters } from './elasticsearch';

export class AppsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly appsService: AppsService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  get = flow(
    this.appsService.get,
    this.permissionsService.asUser(this.jwt).chainValidateResultOrRaiseUnauthorized,
    TE.map(dropSdkPermissionsKeyIfNotCreator(this.userId)),
  );

  search = (filters: EsAppsInternalFilters) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
    TE.chainEitherKW(this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters),
    TE.chainW(this.appsService.search),
    TE.map(dropSdkPaginationPermissionsKeysIfNotCreator(this.userId)),
  );

  unarchive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.appsService.get(id),
    }),
    TE.chainW(() => this.appsService.unarchive(id)),
  );

  archive = (id: TableId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.appsService.get(id),
    }),
    TE.chainW(() => this.appsService.archive(id)),
  );

  update = (attrs: SdkUpdateAppInputT & TableRowWithId) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.appsService.get(attrs.id),
    }),
    TE.chainW(() => this.appsService.update(attrs)),
  );

  create = (dto: SdkCreateAppInputT) => pipe(
    this.permissionsService.asUser(this.jwt).enforceOrganizationCreatorScope(dto),
    TE.fromEither,
    TE.chainW(this.appsService.create),
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );

  summarizeChatToApp = flow(
    this.appsService.summarizeChatToApp,
    this.tryTEIfUser.oneOfOrganizationRole('owner', 'tech'),
  );
}
