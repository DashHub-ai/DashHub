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
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_groups').execute();
}
