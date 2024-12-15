import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('s3_resources_bucket_id_name_index')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .createIndex('s3_resources_bucket_id_name_index')
    .on('s3_resources')
    .unique()
    .columns(['bucket_id', 'name'])
    .execute();
}
