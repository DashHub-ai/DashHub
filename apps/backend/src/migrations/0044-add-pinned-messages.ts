import type { Kysely } from 'kysely';

import { addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('pinned_messages')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('creator_user_id', 'integer', col => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('message_id', 'uuid', col => col.references('messages.id').onDelete('restrict'))
    .execute();

  await db.schema
    .createIndex('pinned_messages_uniq_index')
    .on('pinned_messages')
    .unique()
    .columns(['creator_user_id', 'message_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('pinned_messages').execute();
}
