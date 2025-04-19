import type { Kysely } from 'kysely';

import {
  addArchivedAtColumns,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('ai_external_apis')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('organization_id', 'integer', col => col.notNull().references('organizations.id').onDelete('restrict'))
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('logo_s3_resource_id', 'integer', col => col.references('s3_resources.id').onDelete('restrict'))
    .addColumn('description', 'text')
    .addColumn('schema', 'jsonb', col => col.notNull().defaultTo('{}'))
    .execute();

  await db.schema
    .createIndex('ai_external_apis_organization_id_index')
    .on('ai_external_apis')
    .column('organization_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('ai_external_apis').execute();
}
