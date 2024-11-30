import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('messages')
    .dropColumn('original_message_id')
    .dropColumn('repeat_count')
    .addColumn('replied_message_id', 'uuid', col => col.references('messages.id').onDelete('restrict'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('messages')
    .addColumn('original_message_id', 'uuid', col => col.references('messages.id').onDelete('restrict'))
    .addColumn('repeat_count', 'integer', col => col.notNull().defaultTo(0))
    .dropColumn('replied_message_id')
    .execute();
}
