import type { Kysely } from 'kysely';

import {
  addArchivedAtColumns,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('apps_categories')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('icon', 'text', col => col.notNull())
    .addColumn('description', 'text')
    .addColumn('parent_category_id', 'integer', col => col.references('apps_categories.id'))
    .execute();

  await db.schema
    .alterTable('apps')
    .addColumn('category_id', 'integer', col => col.references('apps_categories.id'))
    .execute();

  const { id } = await db
    .insertInto('apps_categories')
    .values([
      { name: 'Other', icon: 'ellipsis', description: 'Other apps that do not fit into any other category' },
    ])
    .returning('id')
    .executeTakeFirstOrThrow();

  await db
    .updateTable('apps')
    .set({ category_id: id })
    .execute();

  await db.schema
    .alterTable('apps')
    .alterColumn('category_id', col => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('apps').dropColumn('category_id').execute();
  await db.schema.dropTable('apps_categories').execute();
}
