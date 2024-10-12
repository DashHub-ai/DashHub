import { type Kysely, sql } from 'kysely';

import {
  addArchivedAtColumns,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('apps')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('chat_context', 'text', col => col.notNull().check(sql`trim(chat_context) <> ''`))
    .addColumn('organization_id', 'integer', col =>
      col.references('organizations.id').notNull().onDelete('restrict'))
    .execute();

  await db.schema
    .createIndex('apps_organization_id_index')
    .on('apps')
    .columns(['organization_id'])
    .execute();

  await db.schema
    .createIndex('apps_uniq_name_index')
    .on('apps')
    .columns(['organization_id', 'name'])
    .unique()
    .where(sql.ref('archived'), '=', false)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('apps').execute();
}
