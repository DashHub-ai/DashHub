import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('s3_resources_buckets')
    .addColumn('endpoint', 'text', col => col.notNull())
    .addColumn('port', 'integer', col => col.notNull())
    .addColumn('ssl', 'boolean', col => col.notNull().defaultTo(true))
    .addColumn('bucket_name', 'text', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('s3_resources_buckets')
    .dropColumn('endpoint')
    .dropColumn('port')
    .dropColumn('ssl')
    .dropColumn('bucket_name')
    .execute();
}
