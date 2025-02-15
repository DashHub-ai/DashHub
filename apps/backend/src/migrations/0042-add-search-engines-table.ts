import type { Kysely } from 'kysely';

import { addArchivedAtColumns, addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('search_engines')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('description', 'text')
    .addColumn('default', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('provider', 'varchar', col => col.notNull())
    .addColumn('credentials', 'jsonb', col => col.notNull())
    .addColumn('organization_id', 'integer', col =>
      col.notNull().references('organizations.id').onDelete('cascade'))
    .execute();

  await db.schema
    .createIndex('search_engines_organization_default_index')
    .on('search_engines')
    .columns(['organization_id', 'default'])
    .where('default', '=', true)
    .unique()
    .execute();

  await db.schema
    .createIndex('search_engines_organization_name_index')
    .on('search_engines')
    .unique()
    .columns(['organization_id', 'name'])
    .execute();

  await db.schema
    .createIndex('search_engines_organization_id_idx')
    .on('search_engines')
    .column('organization_id')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema
    .dropTable('search_engines')
    .execute();
}
