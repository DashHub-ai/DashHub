import { flow } from 'fp-ts/lib/function';

import {
  ofSdkUnauthorizedErrorTE,
  type SdkCreateChatInputT,
  type SdkJwtTokenT,
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
  ) {
    super(jwt);
  }

  // TODO: Add belongs checks
  get = flow(
    this.chatsService.get,
    this.tryTEIfUser.is.root,
  );

  // TODO: Add belongs checks
  search = flow(
    this.chatsService.search,
    this.tryTEIfUser.is.root,
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
