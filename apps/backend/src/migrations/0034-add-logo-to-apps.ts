import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('apps')
    .addColumn('logo_s3_resource_id', 'integer', col => col.references('s3_resources.id').onDelete('set null'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('apps')
    .dropColumn('logo_s3_resource_id')
    .execute();
}
