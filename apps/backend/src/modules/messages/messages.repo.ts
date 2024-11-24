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
            .leftJoin('ai_models', 'ai_models.id', 'messages.ai_model_id')
            .select([
              'users.id as creator_user_id',
              'users.email as creator_email',

              'ai_models.id as ai_model_id',
              'ai_models.name as ai_model_name',
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

          ai_model_id: aiModelId,
          ai_model_name: aiModelName,

          ...item
        }): MessageTableRowWithRelations => ({
          ...camelcaseKeys(item),
          repeats: [],
          chat: {
            id: chatId,
          },
          aiModel: aiModelId && aiModelName
            ? {
                id: aiModelId,
                name: aiModelName,
              }
            : null,
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
