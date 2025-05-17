import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { Nullable } from '@dashhub/commons';

import {
  ofSdkSuccess,
  ofSdkUnauthorizedErrorTE,
  type SdkJwtTokenT,
  type SdkSearchAllFavoritesInputT,
  type SdkTableRowIdT,
  type SdkUnauthorizedError,
  type SdkUpsertFavoriteInputT,
} from '@dashhub/sdk';

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

  findAll = ({ organizationId, ...filters }: SdkSearchAllFavoritesInputT) => {
    const { enforceMatchingOrganizationId } = this.permissionsService.asUser(this.jwt);

    return pipe(
      TE.Do,
      TE.bind('organizationId', (): TE.TaskEither<SdkUnauthorizedError, Nullable<SdkTableRowIdT>> => {
        if (this.jwt.role === 'root') {
          return TE.right(organizationId);
        }

        if (!organizationId) {
          return ofSdkUnauthorizedErrorTE();
        }

        return pipe(
          enforceMatchingOrganizationId(organizationId),
          TE.fromEither,
        );
      }),
      TE.chainW(({ organizationId }) =>
        this.usersFavoritesService.findAll({
          ...filters,
          userId: this.userId,
          ...organizationId && { organizationId },
        }),
      ),
    );
  };

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
