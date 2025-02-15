import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  AbstractDatabaseRepo,
  DatabaseError,
  TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { UsersAISettingsTableInsertRow } from './users-ai-settings.tables';

@injectable()
export class UsersAISettingsRepo extends AbstractDatabaseRepo {
  upsert = (
    {
      forwardTransaction,
      value,
    }: TransactionalAttrs<{ value: UsersAISettingsTableInsertRow; }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction,
    });

    return pipe(
      transaction(trx =>
        trx
          .insertInto('users_ai_settings')
          .values({
            user_id: value.userId,
            chat_context: value.chatContext || null,
          })
          .onConflict(oc => oc
            .column('user_id')
            .doUpdateSet(eb => ({
              chat_context: eb.ref('excluded.chat_context'),
            })),
          )
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };
}
