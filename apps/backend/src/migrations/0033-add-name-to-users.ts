import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .addColumn('name', 'text')
    .execute();

  await db
    .updateTable('users')
    .set({ name: 'User' })
    .where('name', 'is', null)
    .execute();

  await db.schema
    .alterTable('users')
    .alterColumn('name', col => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users')
    .dropColumn('name')
    .execute();
}
