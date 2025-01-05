import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type { PermissionsService } from '~/modules/permissions';

import {
  dropSdkPaginationPermissionsKeysIfNotCreator,
  dropSdkPermissionsKeyIfNotCreator,
  ofSdkUnauthorizedErrorTE,
  type SdkCreateChatInputT,
  type SdkJwtTokenT,
  type SdkSearchChatsInputT,
  type SdkUnauthorizedError,
  type SdkUpdateChatInputT,
} from '@llm/sdk';
import { AuthFirewallService } from '~/modules/auth/firewall';

import type { DatabaseTE, TableRowWithUuid, TableUuid, TransactionError } from '../database';
import type { EsDocumentNotFoundError, EsIndexingError, EsInternalError } from '../elasticsearch';
import type { ChatsService } from './chats.service';

export class ChatsFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly chatsService: ChatsService,
    private readonly permissionsService: PermissionsService,
  ) {
    super(jwt);
  }

  get = flow(
    this.chatsService.get,
    this.permissionsService
      .asUser(this.jwt)
      .chainValidateResultOrRaiseUnauthorized('read'),
    TE.map(dropSdkPermissionsKeyIfNotCreator(this.userId)),
  );

  unarchive = (id: TableUuid) => pipe(
    this.permissionsService
      .asUser(this.jwt)
      .findRecordAndCheckPermissions({
        accessLevel: 'write',
        findRecord: this.chatsService.get(id),
      }),
    TE.chainW(() => this.chatsService.unarchive(id)),
  );

  archive = (id: TableUuid) => pipe(
    this.permissionsService
      .asUser(this.jwt)
      .findRecordAndCheckPermissions({
        accessLevel: 'write',
        findRecord: this.chatsService.get(id),
      }),
    TE.chainW(() => this.chatsService.archive(id)),
  );

  update = (attrs: SdkUpdateChatInputT & TableRowWithUuid) => pipe(
    this.permissionsService
      .asUser(this.jwt)
      .findRecordAndCheckPermissions({
        accessLevel: 'write',
        findRecord: this.chatsService.get(attrs.id),
      }),
    TE.chainW(() => this.chatsService.update(attrs)),
  );

  search = (filters: SdkSearchChatsInputT) => pipe(
    filters,
    this.permissionsService
      .asUser(this.jwt)
      .enforceSatisfyPermissionsFilters('read'),
    TE.chainW(this.chatsService.search),
    TE.map(dropSdkPaginationPermissionsKeysIfNotCreator(this.userId)),
  );

  create = ({ creator, organization, ...chat }: SdkCreateChatInputT): DatabaseTE<
    TableRowWithUuid,
    SdkUnauthorizedError | TransactionError | EsInternalError | EsDocumentNotFoundError | EsIndexingError
  > => {
    const { jwt } = this;

    switch (jwt.role) {
      case 'root':
        if (!organization) {
          return ofSdkUnauthorizedErrorTE();
        }

        return this.chatsService.create({
          ...chat,
          creator: creator ?? this.userIdRow,
          organization,
        });

      case 'user':
        return this.chatsService.create({
          ...chat,
          creator: this.userIdRow,
          organization: jwt.organization,
        });

      default: {
        const _: never = jwt;

        return ofSdkUnauthorizedErrorTE();
      }
    }
  };
}
