import { array as A, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import type {
  SdkFavoriteT,
  SdkFavoriteTypeT,
  SdkUpsertFavoriteInputT,
} from '@llm/sdk';

import { rejectFalsyItems } from '@llm/commons';
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
      favorite: SdkUpsertFavoriteInputT;
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

  delete = (
    {
      forwardTransaction,
      userId,
      favorite,
    }: TransactionalAttrs<{
      userId: TableId;
      favorite: SdkUpsertFavoriteInputT;
    }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction,
    });

    return pipe(
      transaction((trx) => {
        let query = trx
          .deleteFrom('users_favorites')
          .where('user_id', '=', userId);

        switch (favorite.type) {
          case 'chat':
            query = query.where('chat_id', '=', favorite.id);
            break;

          case 'app':
            query = query.where('app_id', '=', favorite.id);
            break;

          default: {
            const _: never = favorite;
            throw new Error('Unsupported favorite type!');
          }
        }

        return query.execute();
      }),
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
  ): DatabaseTE<SdkUpsertFavoriteInputT[]> => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction,
    });

    return pipe(
      transaction((trx) => {
        let query = trx
          .selectFrom('users_favorites')
          .selectAll()
          .limit(limit)
          .where('user_id', '=', userId);

        if (type === 'app' || type === undefined) {
          query = query
            .leftJoin('apps', 'apps.id', 'users_favorites.app_id')
            .leftJoin('organizations as app_orgs', 'app_orgs.id', 'apps.organization_id')
            .$if(!!organizationId, q => q.where('app_orgs.id', '=', organizationId!))
            .where(eb => eb.or(
              rejectFalsyItems([
                !type && eb('users_favorites.app_id', 'is', null),
                eb('apps.archived', '=', false),
              ]),
            ),
            );
        }

        if (type === 'chat' || type === undefined) {
          query = query
            .leftJoin('chats', 'chats.id', 'users_favorites.chat_id')
            .leftJoin('organizations as chat_orgs', 'chat_orgs.id', 'chats.organization_id')
            .$if(!!organizationId, q => q.where('chat_orgs.id', '=', organizationId!))
            .where(eb => eb.or(
              rejectFalsyItems([
                !type && eb('users_favorites.chat_id', 'is', null),
                eb('chats.archived', '=', false),
              ]),
            ));
        }

        return query.execute();
      }),
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
  organizationId?: TableId;
  type?: SdkFavoriteTypeT;
  limit?: number;
};
