import { type Kysely, sql } from 'kysely';

import { addArchivedAtColumns, addIdColumn, addTimestampColumns } from './utils';
import { addUuidColumn } from './utils/add-uuid';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('chats')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('creator_user_id', 'integer', col => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('organization_id', 'integer', col => col.notNull().references('organizations.id').onDelete('restrict'))
    .addColumn('public', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('last_message_at', 'timestamp')
    .execute();

  await db.schema
    .createTable('chat_summaries')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('chat_id', 'bigint', col => col.notNull().references('chats.id').onDelete('restrict'))
    .addColumn('content', 'text', col => col.notNull())
    .execute();

  await db.schema
    .createType('message_role')
    .asEnum(['user', 'assistant', 'system'])
    .execute();

  await db.schema
    .createTable('messages')
    .$call(addUuidColumn)
    .$call(addTimestampColumns)
    .addColumn('chat_id', 'bigint', col => col.notNull().references('chats.id').onDelete('restrict'))
    .addColumn('content', 'text', col => col.notNull())
    .addColumn('role', sql`message_role`, col => col.notNull())
    .addColumn('metadata', 'jsonb', col => col.notNull().defaultTo('{}'))
    .addColumn('original_message_id', 'uuid', col => col.references('messages.id').onDelete('restrict'))
    .addColumn('repeat_count', 'integer', col => col.notNull().defaultTo(0))
    .execute();

  await db.schema
    .createIndex('chats_organization_id_index')
    .on('chats')
    .column('organization_id')
    .execute();

  await db.schema
    .createIndex('messages_chat_id_index')
    .on('messages')
    .column('chat_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('messages').execute();
  await db.schema.dropTable('chat_summaries').execute();
  await db.schema.dropTable('chats').execute();
  await db.schema.dropType('message_role').execute();
}
