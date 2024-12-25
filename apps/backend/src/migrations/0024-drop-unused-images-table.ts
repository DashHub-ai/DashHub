import type { Kysely } from 'kysely';

import {
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('s3_resources_images').execute();
}

export async function down(db: Kysely<any>): Promise<void> {
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
}
