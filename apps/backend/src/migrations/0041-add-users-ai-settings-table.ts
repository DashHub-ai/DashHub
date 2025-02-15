import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_ai_settings')
    .addColumn('user_id', 'integer', col => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('chat_context', 'text')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_ai_settings').execute();
}
