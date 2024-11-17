import type { Kysely } from 'kysely';

import { addAIGeneratedColumns, dropAIGeneratedColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('chats').dropColumn('last_message_at').execute();
  await db.schema.alterTable('chat_summaries').dropColumn('content').execute();

  for (const field of ['name', 'content']) {
    await db.schema
      .alterTable('chat_summaries')
      .$call(addAIGeneratedColumns(field))
      .execute();
  }
}

export async function down(db: Kysely<any>): Promise<void> {
  for (const field of ['name', 'content']) {
    await db.schema
      .alterTable('chat_summaries')
      .$call(dropAIGeneratedColumns(field))
      .execute();
  }
  await db.schema
    .alterTable('chat_summaries')
    .addColumn('content', 'text', col => col.notNull())
    .execute();

  await db.schema.alterTable('chats').addColumn('last_message_at', 'timestamp').execute();
}
