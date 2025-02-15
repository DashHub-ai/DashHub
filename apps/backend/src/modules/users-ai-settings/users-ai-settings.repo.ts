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
export class UsersAISettings extends AbstractDatabaseRepo {
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

    const newContext = value.chatContext || null;

    return pipe(
      transaction(trx =>
        trx
          .insertInto('users_ai_settings')
          .values({
            user_id: value.userId,
            chat_context: newContext,
          })
          .onConflict(oc => oc
            .column('user_id')
            .doUpdateSet({
              chat_context: newContext,
            }),
          )
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };
}
