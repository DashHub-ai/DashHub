import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('apps')
    .addColumn('ai_model_id', 'integer', col => col.references('ai_models.id').onDelete('restrict'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('apps')
    .dropColumn('ai_model_id')
    .execute();
}
