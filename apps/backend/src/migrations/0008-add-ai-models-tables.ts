import type { Kysely } from 'kysely';

import { addArchivedAtColumns, addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('ai_models')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('description', 'text')
    .addColumn('provider', 'varchar', col => col.notNull())
    .addColumn('credentials', 'jsonb', col => col.notNull())
    .addColumn('organization_id', 'integer', col =>
      col.notNull().references('organizations.id').onDelete('cascade'))
    .execute();

  await db.schema
    .createIndex('ai_models_organization_name_index')
    .on('ai_models')
    .unique()
    .columns(['organization_id', 'name'])
    .execute();

  await db.schema
    .createIndex('ai_models_organization_id_idx')
    .on('ai_models')
    .column('organization_id')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema
    .dropTable('ai_models')
    .execute();
}
