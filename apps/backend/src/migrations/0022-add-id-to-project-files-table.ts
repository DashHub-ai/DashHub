import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('projects_files')
    .addColumn('id', 'serial', col => col.primaryKey())
    .addColumn('created_at', 'timestamptz', col => col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', col => col.notNull().defaultTo(sql`NOW()`))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('projects_files')
    .dropColumn('id')
    .dropColumn('created_at')
    .dropColumn('updated_at')
    .execute();
}
