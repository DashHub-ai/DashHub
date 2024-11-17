import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  createDatabaseRepo,
  DatabaseError,
  type TableUuid,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { MessageTableRowWithRelations } from './messages.tables';

@injectable()
export class MessagesRepo extends createDatabaseRepo('messages') {
  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableUuid[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('messages.id', 'in', ids)
            .leftJoin('users', 'users.id', 'messages.creator_user_id')
            .select([
              'users.id as creator_user_id',
              'users.email as creator_email',
            ])
            .selectAll('messages')
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          chat_id: chatId,
          creator_user_id: userId,
          creator_email: userEmail,
          ...item
        }): MessageTableRowWithRelations => ({
          ...camelcaseKeys(item),
          repeats: [],
          chat: {
            id: chatId,
          },
          creator: userId && userEmail
            ? {
                id: userId,
                email: userEmail,
              }
            : null,
        })),
      ),
    );
  };
}
