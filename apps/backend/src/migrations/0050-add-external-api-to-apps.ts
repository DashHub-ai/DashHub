import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('ai_external_apis')
    .addColumn('internal', 'boolean', col => col.defaultTo(false))
    .execute();

  await db.schema
    .alterTable('apps')
    .addColumn('ai_external_api_id', 'integer', col => col.references('ai_external_apis.id').onDelete('restrict'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('apps')
    .dropColumn('ai_external_api_id')
    .execute();

  await db.schema
    .alterTable('ai_external_apis')
    .dropColumn('internal')
    .execute();
}
