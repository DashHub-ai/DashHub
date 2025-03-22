import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  AbstractDatabaseRepo,
  DatabaseError,
  type TableId,
  TableUuid,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

@injectable()
export class UsersFavoritesRepo extends AbstractDatabaseRepo {
  upsert = (
    {
      forwardTransaction,
      value,
    }: TransactionalAttrs<{
      value: UpsertUserFavoritesAttrs;
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
            user_id: value.userId,
            chat_id: value.resource.type === 'chat' ? value.resource.id : null,
            app_id: value.resource.type === 'app' ? value.resource.id : null,
          })
          .onConflict(oc => oc.doNothing())
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };

  getFavoritesByUserId = <T extends UserFavoritesType>(
    {
      forwardTransaction,
      organizationId,
      userId,
      type,
      id,
    }: TransactionalAttrs<{
      userId: TableId;
      organizationId: TableId;
      type: T;
      id: InferUserFavoritesId<T>;
    }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction,
    });

    return pipe(
      transaction(trx =>
        trx
          .selectFrom('users_favorites')
          .selectAll()
          .where('user_id', '=', userId)

          .$if(type === 'app', q =>
            q
              .where('app_id', '=', id as TableId)
              .innerJoin('apps', 'apps.id', 'app_id')
              .innerJoin('organizations', 'organizations.id', 'apps.organization_id')
              .where('organizations.id', '=', organizationId))

          .$if(type === 'chat', q =>
            q.where('chat_id', '=', id as TableUuid)
              .innerJoin('chats', 'chats.id', 'chat_id')
              .innerJoin('organizations', 'organizations.id', 'chats.organization_id')
              .where('organizations.id', '=', organizationId))

          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };
}

type UpsertUserFavoritesAttrs = {
  userId: TableId;
  resource:
    | { type: 'app'; id: TableId; }
    | { type: 'chat'; id: TableUuid; };
};

type UserFavoritesType = UpsertUserFavoritesAttrs['resource']['type'];

type InferUserFavoritesId<T extends UserFavoritesType> = Extract<
  UpsertUserFavoritesAttrs['resource'],
  { type: T; }
>['id'];
