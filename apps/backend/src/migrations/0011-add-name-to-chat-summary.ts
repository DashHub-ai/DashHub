import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('chats').dropColumn('last_message_at').execute();
  await db.schema
    .alterTable('chat_summaries')
    .addColumn('name', 'text')
    .addColumn('name_generated', 'boolean', col => col.notNull().defaultTo(true))
    .addColumn('content_generated', 'boolean', col => col.notNull().defaultTo(true))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chat_summaries')
    .dropColumn('name')
    .dropColumn('name_generated')
    .dropColumn('content_generated')
    .execute();

  await db.schema.alterTable('chats').addColumn('last_message_at', 'timestamp').execute();
}
