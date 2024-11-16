import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('organizations_s3_resources_buckets_default_index').execute();
  await db.schema
    .createIndex('organizations_s3_resources_buckets_default_index')
    .on('organizations_s3_resources_buckets')
    .columns(['organization_id', 'default'])
    .where('default', '=', true)
    .unique()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('organizations_s3_resources_buckets_default_index').execute();
  await db.schema
    .createIndex('organizations_s3_resources_buckets_default_index')
    .on('organizations_s3_resources_buckets')
    .columns(['organization_id', 'default'])
    .where('default', '=', true)
    .execute();
}
