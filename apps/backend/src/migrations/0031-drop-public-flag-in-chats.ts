import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chats')
    .dropColumn('public')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chats')
    .addColumn('public', 'boolean', col => col.notNull().defaultTo(false))
    .execute();
}
