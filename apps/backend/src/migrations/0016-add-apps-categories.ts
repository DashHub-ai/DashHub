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
    .addColumn('organization_id', 'integer', col => col.references('organizations.id').notNull())
    .addColumn('parent_category_id', 'integer', col => col.references('apps_categories.id'))
    .execute();

  await db.schema
    .createIndex('apps_categories_organization_index')
    .on('apps_categories')
    .column('organization_id')
    .execute();

  await db.schema
    .alterTable('apps')
    .addColumn('category_id', 'integer', col => col.references('apps_categories.id'))
    .execute();

  const organizations = await db
    .selectFrom('organizations')
    .select(['id'])
    .execute();

  for (const org of organizations) {
    const { id } = await db
      .insertInto('apps_categories')
      .values([
        {
          name: 'Other',
          icon: 'ellipsis',
          description: 'Other apps that do not fit into any other category',
          organization_id: org.id,
        },
      ])
      .returning('id')
      .executeTakeFirstOrThrow();

    await db
      .updateTable('apps')
      .set({ category_id: id })
      .where('organization_id', '=', org.id)
      .execute();
  }

  await db.schema
    .alterTable('apps')
    .alterColumn('category_id', col => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('apps').dropColumn('category_id').execute();
  await db.schema.dropTable('apps_categories').execute();
}
