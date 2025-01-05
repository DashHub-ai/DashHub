import { taskEither as TE } from 'fp-ts';
import { flow, pipe } from 'fp-ts/lib/function';

import type { PermissionsService } from '~/modules/permissions';

import {
  dropPaginationSdkPermissionsKeys,
  ofSdkUnauthorizedErrorTE,
  type SdkCreateChatInputT,
  type SdkJwtTokenT,
  type SdkSearchChatsInputT,
  type SdkUnauthorizedError,
} from '@llm/sdk';
import { AuthFirewallService } from '~/modules/auth/firewall';

import type { DatabaseTE, TableRowWithUuid, TransactionError } from '../database';
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
    this.permissionsService.chainValidateResultOrRaiseUnauthorized({
      accessLevel: 'read',
      userId: this.userId,
    }),
  );

  // TODO: Add belongs checks
  unarchive = flow(
    this.chatsService.unarchive,
    this.tryTEIfUser.is.root,
  );

  // TODO: Add belongs checks
  archive = flow(
    this.chatsService.archive,
    this.tryTEIfUser.is.root,
  );

  // TODO: Add belongs checks
  update = flow(
    this.chatsService.update,
    this.tryTEIfUser.is.root,
  );

  search = (filters: SdkSearchChatsInputT) => pipe(
    filters,
    this.permissionsService.enforceSatisfyPermissionsFilters({
      accessLevel: 'read',
      userId: this.userId,
    }),
    TE.chainW(this.chatsService.search),
    TE.map(dropPaginationSdkPermissionsKeys),
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
