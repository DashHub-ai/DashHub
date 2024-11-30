import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('messages')
    .addColumn('replied_message_id', 'uuid', col => col.references('messages.id').onDelete('restrict'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('messages')
    .dropColumn('replied_message_id')
    .execute();
}
