import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('messages')
    .addColumn('app_id', 'integer', col => col.references('apps.id').onDelete('restrict'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('messages')
    .dropColumn('app_id')
    .execute();
}
