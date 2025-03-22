import { array as A, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import type { SdkFavoriteT, SdkFavoriteTypeT, SdkUpsertFavoriteT } from '@llm/sdk';

import {
  AbstractDatabaseRepo,
  DatabaseError,
  DatabaseTE,
  type TableId,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

@injectable()
export class UsersFavoritesRepo extends AbstractDatabaseRepo {
  upsert = (
    {
      forwardTransaction,
      userId,
      favorite,
    }: TransactionalAttrs<{
      userId: TableId;
      favorite: SdkUpsertFavoriteT;
    }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction,
    });

    return pipe(
      transaction(trx =>
        trx
          .insertInto('users_favorites')
          .values({
            user_id: userId,
            chat_id: favorite.type === 'chat' ? favorite.id : null,
            app_id: favorite.type === 'app' ? favorite.id : null,
          })
          .onConflict(oc => oc.doNothing())
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };

  findAll = (
    {
      forwardTransaction,
      organizationId,
      userId,
      type,
      limit = 500,
    }: TransactionalAttrs<UserFavoritesInternalSearchAttrs>,
  ): DatabaseTE<SdkFavoriteT[]> => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction,
    });

    return pipe(
      transaction(trx =>
        trx
          .selectFrom('users_favorites')
          .selectAll()
          .limit(limit)
          .where('user_id', '=', userId)

          .$if(type === 'app', q =>
            q
              .innerJoin('apps', 'apps.id', 'app_id')
              .innerJoin('organizations', 'organizations.id', 'apps.organization_id')
              .where('organizations.id', '=', organizationId)
              .where('apps.archived', '=', false))

          .$if(type === 'chat', q =>
            q
              .innerJoin('chats', 'chats.id', 'chat_id')
              .innerJoin('organizations', 'organizations.id', 'chats.organization_id')
              .where('organizations.id', '=', organizationId)
              .where('chats.archived', '=', false))

          .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.filterMap((item) => {
          if (item.app_id) {
            return O.some(
              {
                type: 'app',
                id: item.app_id,
              } as SdkFavoriteT,
            );
          }

          if (item.chat_id) {
            return O.some(
              {
                type: 'chat',
                id: item.chat_id,
              } as SdkFavoriteT,
            );
          }

          return O.none;
        }),
      ),
    );
  };
}

export type UserFavoritesInternalSearchAttrs = {
  userId: TableId;
  organizationId: TableId;
  type: SdkFavoriteTypeT;
  limit?: number;
};
