import { type Kysely, sql } from 'kysely';

import {
  addArchivedAtColumns,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('projects')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('organization_id', 'integer', col =>
      col.references('organizations.id').notNull().onDelete('restrict'))
    .execute();

  await db.schema
    .createIndex('projects_organization_id_index')
    .on('projects')
    .columns(['organization_id'])
    .execute();

  await db.schema
    .createIndex('projects_uniq_name_index')
    .on('projects')
    .columns(['organization_id', 'name'])
    .unique()
    .where(sql.ref('archived'), '=', false)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('projects').execute();
}
