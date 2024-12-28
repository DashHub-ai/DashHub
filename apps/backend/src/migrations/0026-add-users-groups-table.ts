import type { Kysely } from 'kysely';

import { addArchivedAtColumns, addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_groups')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('organization_id', 'integer', col => col.notNull().references('organizations.id').onDelete('restrict'))
    .addColumn('creator_user_id', 'integer', col => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('name', 'text', col => col.notNull())
    .execute();

  await db.schema
    .createTable('users_groups_users')
    .addColumn('user_id', 'integer', col => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('group_id', 'integer', col => col.notNull().references('users_groups.id').onDelete('cascade'))
    .addUniqueConstraint('user_id_group_id_unique', ['user_id', 'group_id'])
    .execute();

  await db.schema
    .createIndex('users_groups_organization_id_index')
    .on('users_groups')
    .column('organization_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_groups_users').execute();
  await db.schema.dropTable('users_groups').execute();
}
