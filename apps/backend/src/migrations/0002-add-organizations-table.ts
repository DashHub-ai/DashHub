import { type Kysely, sql } from 'kysely';

import {
  addArchivedAtColumns,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('organizations')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('name', 'text', col => col.notNull())
    .addColumn(
      'max_number_of_users',
      'integer',
      col => col.notNull().check(sql`max_number_of_users > 0`).defaultTo(1),
    )
    .execute();

  await db.schema
    .createIndex('organizations_name_index')
    .on('organizations')
    .unique()
    .column('name')
    .where(sql.ref('archived'), '=', false)
    .execute();

  await db.schema
    .createType('organization_role')
    .asEnum(['owner', 'member'])
    .execute();

  await db.schema
    .createTable('organizations_users')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('organization_id', 'integer', col =>
      col.references('organizations.id').notNull().onDelete('cascade'))
    .addColumn('user_id', 'integer', col =>
      col.references('users.id').notNull().onDelete('cascade'))
    .addColumn('role', sql`organization_role`, col => col.notNull().defaultTo('member'))
    .execute();

  await db.schema
    .createIndex('organizations_users_organization_id_user_id_index')
    .on('organizations_users')
    .unique()
    .columns(['organization_id', 'user_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('organizations_users').execute();
  await db.schema.dropType('organization_role').execute();
  await db.schema.dropTable('organizations').execute();
}
