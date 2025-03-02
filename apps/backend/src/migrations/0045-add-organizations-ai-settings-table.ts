import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('organizations_ai_settings')
    .addColumn('organization_id', 'integer', col => col.unique().notNull().references('organizations.id').onDelete('restrict'))
    .addColumn('chat_context', 'text')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('organizations_ai_settings').execute();
}
