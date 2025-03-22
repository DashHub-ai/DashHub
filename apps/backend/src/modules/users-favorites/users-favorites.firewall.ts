import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import {
  ofSdkSuccess,
  ofSdkUnauthorizedErrorTE,
  type SdkJwtTokenT,
  type SdkUnauthorizedError,
  type SdkUpsertFavoriteInputT,
} from '@llm/sdk';

import type { AppsService } from '../apps';
import type { ChatsService } from '../chats';
import type { DatabaseError } from '../database';
import type { EsDocumentNotFoundError } from '../elasticsearch';
import type { PermissionsService } from '../permissions';
import type { UsersFavoritesService } from './users-favorites.service';

import { AuthFirewallService } from '../auth';

export class UsersFavoritesFirewall extends AuthFirewallService {
  constructor(
    jwt: SdkJwtTokenT,
    private readonly usersFavoritesService: UsersFavoritesService,
    private readonly permissionsService: PermissionsService,
    private readonly chatsService: Readonly<ChatsService>,
    private readonly appsService: Readonly<AppsService>,
  ) {
    super(jwt);
  }

  upsert = (favorite: SdkUpsertFavoriteInputT) => {
    return pipe(
      this.guardFavoriteAccess(favorite),
      TE.chainW(() => this.usersFavoritesService.upsert({
        userId: this.userId,
        favorite,
      })),
      TE.map(() => ofSdkSuccess()),
    );
  };

  delete = (favorite: SdkUpsertFavoriteInputT) => {
    return pipe(
      this.guardFavoriteAccess(favorite),
      TE.chainW(() => this.usersFavoritesService.delete({
        userId: this.userId,
        favorite,
      })),
      TE.map(() => ofSdkSuccess()),
    );
  };

  findAll = () => this.usersFavoritesService.findAll({
    userId: this.userId,
    ...this.jwt.role !== 'root' && {
      organizationId: this.jwt.organization.id,
    },
  });

  private guardFavoriteAccess = (favorite: SdkUpsertFavoriteInputT): TE.TaskEither<
    SdkUnauthorizedError | DatabaseError | EsDocumentNotFoundError,
    unknown
  > => {
    const asUser = this.permissionsService.asUser(this.jwt);

    switch (favorite.type) {
      case 'chat':
        return asUser.findRecordAndCheckPermissions({
          accessLevel: 'read',
          findRecord: this.chatsService.get(favorite.id),
        });

      case 'app':
        return asUser.findRecordAndCheckPermissions({
          accessLevel: 'read',
          findRecord: this.appsService.get(favorite.id),
        });

      default: {
        const _: never = favorite;

        return ofSdkUnauthorizedErrorTE();
      }
    }
  };
}
