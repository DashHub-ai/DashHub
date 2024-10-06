import type { Kysely } from 'kysely';

import { addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('auth_passwords')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('user_id', 'integer', col =>
      col.references('users.id').notNull().unique().onDelete('cascade'))
    .addColumn('salt', 'text', col => col.notNull())
    .addColumn('hash', 'text', col => col.notNull())
    .execute();

  await db.schema
    .createTable('auth_emails')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('user_id', 'integer', col =>
      col.references('users.id').notNull().unique().onDelete('cascade'))
    .addColumn('token', 'text')
    .execute();

  await db.schema
    .createTable('auth_reset_passwords')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('user_id', 'integer', col =>
      col.references('users.id').notNull().unique().onDelete('cascade'))
    .addColumn('token', 'text', col => col.notNull())
    .addColumn('expire_at', 'timestamptz', col => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('auth_reset_passwords').execute();
  await db.schema.dropTable('auth_emails').execute();
  await db.schema.dropTable('auth_passwords').execute();
}
