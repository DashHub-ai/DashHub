import { type Kysely, sql } from 'kysely';

import {
  addArchivedAtColumns,
  addArchiveProtectionColumn,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('user_role')
    .asEnum(['root', 'user'])
    .execute();

  await db.schema
    .createTable('users')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .$call(addArchiveProtectionColumn)
    .addColumn('role', sql`user_role`, col => col.notNull().defaultTo('user'))
    .addColumn('email', 'text', col => col.notNull())
    .addColumn('active', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('jwt_refresh_token', 'text')
    .addColumn('last_login_at', 'timestamptz')
    .execute();

  await db.schema
    .createIndex('users_email_uniq_index')
    .on('users')
    .unique()
    .column('email')
    .where(sql.ref('archived'), '=', false)
    .where('email', 'is not', null)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users').execute();
  await db.schema.dropType('user_role').execute();
}
