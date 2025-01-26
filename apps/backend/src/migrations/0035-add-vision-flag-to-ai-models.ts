import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('ai_models')
    .addColumn('vision', 'boolean', col => col.notNull().defaultTo(false))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('ai_models')
    .dropColumn('vision')
    .execute();
}
