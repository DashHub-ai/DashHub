import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type {
  SdkCreateAppInputT,
  SdkJwtTokenT,
  SdkUpdateAppInputT,
} from '@llm/sdk';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { ChatsService } from '../chats';
import type { TableId, TableRowWithId, TableUuid } from '../database';
import type { PermissionsService } from '../permissions';
import type { AppsService } from './apps.service';
import type { EsAppsInternalFilters } from './elasticsearch';

export class AppsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly appsService: AppsService,
    private readonly permissionsService: PermissionsService,
    private readonly chatsService: Readonly<ChatsService>,
  ) {
    super(jwt);
  }

  get = flow(
    this.appsService.get,
    this.permissionsService.asUser(this.jwt).chainValidateResultOrRaiseUnauthorized,
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPermissionsKeyIfNotCreator),
  );

  search = (filters: EsAppsInternalFilters) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
    TE.chainEitherKW(this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters),
    TE.chainW(this.appsService.search),
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPaginationPermissionsKeysIfNotCreator),
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

  summarizeChatToApp = (chatId: TableUuid) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'read',
      findRecord: this.chatsService.get(chatId),
    }),
    TE.chainW(() => this.appsService.summarizeChatToApp(chatId)),
  );
}
