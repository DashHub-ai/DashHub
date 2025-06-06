import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type {
  SdkCreateChatInputT,
  SdkJwtTokenT,
  SdkSearchChatsInputT,
  SdkUpdateChatInputT,
} from '@dashhub/sdk';
import type { PermissionsService } from '~/modules/permissions';

import { AuthFirewallService } from '~/modules/auth/firewall';

import type { TableRowWithUuid, TableUuid } from '../database';
import type { ProjectsService } from '../projects';
import type { ChatsService } from './chats.service';

export class ChatsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly chatsService: ChatsService,
    private readonly permissionsService: PermissionsService,
    private readonly projectsService: Readonly<ProjectsService>,
  ) {
    super(jwt);
  }

  get = flow(
    this.chatsService.get,
    this.permissionsService.asUser(this.jwt).chainValidateResultOrRaiseUnauthorized,
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPermissionsKeyIfNotCreator),
  );

  unarchive = (id: TableUuid) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckIfCreator({
      findRecord: this.chatsService.get(id),
    }),
    TE.chainW(() => this.chatsService.unarchive(id)),
  );

  archive = (id: TableUuid) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckIfCreator({
      findRecord: this.chatsService.get(id),
    }),
    TE.chainW(() => this.chatsService.archive(id)),
  );

  update = (attrs: SdkUpdateChatInputT & TableRowWithUuid) => pipe(
    this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
      accessLevel: 'write',
      findRecord: this.chatsService.get(attrs.id),
    }),
    TE.chainW(() => this.chatsService.update(attrs)),
  );

  search = (filters: SdkSearchChatsInputT) => pipe(
    filters,
    this.permissionsService.asUser(this.jwt).enforcePermissionsFilters,
    TE.chainEitherKW(this.permissionsService.asUser(this.jwt).enforceOrganizationScopeFilters),
    TE.chainW(dto => this.chatsService.search({
      ...dto,
      customization: {
        userId: this.userId,
      },
    })),
    TE.chainW(this.permissionsService.asUser(this.jwt).dropSdkPaginationPermissionsKeysIfNotCreator),
  );

  create = (dto: SdkCreateChatInputT) => pipe(
    TE.Do,
    TE.chainW(() => (
      dto.project
        ? this.permissionsService.asUser(this.jwt).findRecordAndCheckPermissions({
            accessLevel: 'write',
            findRecord: this.projectsService.get(dto.project.id),
          })
        : TE.of(undefined)
    )),
    TE.chainEitherKW(() => this.permissionsService.asUser(this.jwt).enforceOrganizationCreatorScope(dto)),
    TE.chainW(mappedDto => this.chatsService.create(mappedDto)),
  );
}
