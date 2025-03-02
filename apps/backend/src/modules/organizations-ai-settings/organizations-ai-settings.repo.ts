import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  AbstractDatabaseRepo,
  DatabaseError,
  TableId,
  TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { OrganizationsAISettingsTableInsertRow } from './organizations-ai-settings.tables';

@injectable()
export class OrganizationsAISettingsRepo extends AbstractDatabaseRepo {
  getChatContextByOrganizationIdOrNil = (
    {
      forwardTransaction,
      organizationId,
    }: TransactionalAttrs<{ organizationId: TableId; }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction,
    });

    return pipe(
      transaction(trx =>
        trx
          .selectFrom('organizations_ai_settings')
          .select('chat_context as context')
          .where('organization_id', '=', organizationId)
          .executeTakeFirst(),
      ),
      DatabaseError.tryTask,
      TE.map(row => row?.context ?? null),
    );
  };

  upsert = (
    {
      forwardTransaction,
      value,
    }: TransactionalAttrs<{ value: OrganizationsAISettingsTableInsertRow; }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction,
    });

    return pipe(
      transaction(trx =>
        trx
          .insertInto('organizations_ai_settings')
          .values({
            organization_id: value.organizationId,
            chat_context: value.chatContext || null,
          })
          .onConflict(oc => oc
            .column('organization_id')
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
