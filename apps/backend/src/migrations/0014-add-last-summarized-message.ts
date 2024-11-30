import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chat_summaries')
    .dropColumn('ai_model_id')
    .addColumn('last_summarized_message_id', 'uuid', col => col.references('messages.id').onDelete('restrict'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chat_summaries')
    .dropColumn('last_summarized_message_id')
    .addColumn('ai_model_id', 'integer', col => col.references('ai_models.id').onDelete('restrict'))
    .execute();
}
