import { type Kysely, sql } from 'kysely';

import { addArchivedAtColumns, addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  // Create projects_policies table
  await db.schema
    .createTable('projects_policies')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('project_id', 'integer', col => col.notNull().references('projects.id').onDelete('restrict'))
    .addColumn('user_id', 'integer', col => col.references('users.id').onDelete('restrict'))
    .addColumn('group_id', 'integer', col => col.references('users_groups.id').onDelete('restrict'))
    .addColumn('read', 'boolean', col => col.notNull().defaultTo(false))
    .addColumn('write', 'boolean', col => col.notNull().defaultTo(false))
    .addCheckConstraint(
      'user_xor_group_check',
      sql`COALESCE((user_id IS NOT NULL)::int, 0) + COALESCE((group_id IS NOT NULL)::int, 0) >= 1`,
    )
    .addUniqueConstraint('project_id_user_id_group_id_unique', ['project_id', 'user_id', 'group_id'])
    .execute();

  // Alter projects table to add creator_user_id column
  await db.schema
    .alterTable('projects')
    .addColumn('creator_user_id', 'integer', col => col.references('users.id').onDelete('restrict'))
    .execute();

  const rootUser = await db
    .selectFrom('users')
    .select(['id'])
    .where('role', '=', 'root')
    .executeTakeFirstOrThrow();

  await db
    .updateTable('projects')
    .set({ creator_user_id: rootUser.id })
    .execute();

  await db.schema
    .alterTable('projects')
    .alterColumn('creator_user_id', col => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('projects').dropColumn('creator_user_id').execute();
  await db.schema.dropTable('projects_policies').execute();
}
