import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  type FavoritesSdk,
  SdkSearchAllFavoritesInputV,
  SdkUpsertFavoriteInputV,
} from '@dashhub/sdk';
import { ConfigService } from '~/modules/config';
import { UsersFavoritesService } from '~/modules/users-favorites';

import {
  rejectUnsafeSdkErrors,
  sdkSchemaValidator,
  serializeSdkResponseTE,
} from '../../helpers';
import { AuthorizedController } from '../shared/authorized.controller';

@injectable()
export class FavoritesController extends AuthorizedController {
  constructor(
    @inject(ConfigService) configService: ConfigService,
    @inject(UsersFavoritesService) favoritesService: UsersFavoritesService,
  ) {
    super(configService);

    this.router
      .get(
        '/all',
        sdkSchemaValidator('query', SdkSearchAllFavoritesInputV),
        async context => pipe(
          context.req.valid('query'),
          favoritesService.asUser(context.var.jwt).findAll,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<FavoritesSdk['all']>>(context),
        ),
      )
      .delete(
        '/',
        sdkSchemaValidator('json', SdkUpsertFavoriteInputV),
        async context => pipe(
          context.req.valid('json'),
          favoritesService.asUser(context.var.jwt).delete,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<FavoritesSdk['delete']>>(context),
        ),
      )
      .post(
        '/',
        sdkSchemaValidator('json', SdkUpsertFavoriteInputV),
        async context => pipe(
          context.req.valid('json'),
          favoritesService.asUser(context.var.jwt).upsert,
          rejectUnsafeSdkErrors,
          serializeSdkResponseTE<ReturnType<FavoritesSdk['upsert']>>(context),
        ),
      );
  }
}
