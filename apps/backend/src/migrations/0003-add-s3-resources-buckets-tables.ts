import { type Kysely, sql } from 'kysely';

import {
  addArchivedAtColumns,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('s3_resources_buckets')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('access_key_id', 'text', col => col.notNull())
    .addColumn('secret_access_key', 'text', col => col.notNull())
    .addColumn('region', 'text', col => col.notNull().defaultTo('eu'))
    .execute();

  await db.schema
    .createType('s3_resources_type')
    .asEnum(['other', 'image'])
    .execute();

  await db.schema
    .createTable('s3_resources')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('bucket_id', 'integer', col =>
      col.references('s3_resources_buckets.id').notNull().onDelete('restrict'))
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('type', sql`s3_resources_type`, col => col.notNull().defaultTo('other'))
    .addColumn('s3_key', 'text', col => col.notNull())
    .execute();

  await db.schema
    .createTable('s3_resources_images')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('resource_id', 'integer', col =>
      col.references('s3_resources.id').notNull().unique().onDelete('restrict'))
    .addColumn('sm_width', 'integer', col => col.notNull())
    .addColumn('md_width', 'integer', col => col.notNull())
    .addColumn('lg_width', 'integer', col => col.notNull())
    .addColumn('width', 'integer', col => col.notNull())
    .addColumn('height', 'integer', col => col.notNull())
    .execute();

  await db.schema
    .createIndex('s3_resources_bucket_s3_key_index')
    .on('s3_resources')
    .unique()
    .columns(['bucket_id', 's3_key'])
    .execute();

  await db.schema
    .createIndex('s3_resources_bucket_id_name_index')
    .on('s3_resources')
    .unique()
    .columns(['bucket_id', 'name'])
    .execute();

  await db.schema
    .createTable('organizations_s3_resources_buckets')
    .addColumn('organization_id', 'integer', col =>
      col.references('organizations.id').notNull().onDelete('restrict'))
    .addColumn('bucket_id', 'integer', col =>
      col.references('s3_resources_buckets.id').notNull().onDelete('restrict'))
    .addColumn('default', 'boolean', col => col.notNull().defaultTo(false))
    .execute();

  await db.schema
    .createIndex('organizations_s3_resources_buckets_default_index')
    .on('organizations_s3_resources_buckets')
    .columns(['organization_id', 'default'])
    .where('default', '=', true)
    .execute();

  await db.schema
    .createIndex('organizations_s3_resources_buckets_index')
    .on('organizations_s3_resources_buckets')
    .unique()
    .columns(['organization_id', 'bucket_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('s3_resources_images').execute();
  await db.schema.dropTable('s3_resources').execute();
  await db.schema.dropType('s3_resources_type').execute();

  await db.schema.dropTable('organizations_s3_resources_buckets').execute();
  await db.schema.dropTable('s3_resources_buckets').execute();
}
