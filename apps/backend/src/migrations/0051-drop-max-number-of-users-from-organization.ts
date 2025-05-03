import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('organizations')
    .dropColumn('max_number_of_users')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('organizations')
    .addColumn(
      'max_number_of_users',
      'integer',
      col => col.notNull().check(sql`max_number_of_users > 0`).defaultTo(1),
    )
    .execute();
}
