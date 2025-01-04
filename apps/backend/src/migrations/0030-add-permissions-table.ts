import { type Kysely, sql } from 'kysely';

import { addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType('permission_level')
    .asEnum(['read', 'write'])
    .execute();

  await db.schema
    .createType('permission_resource_type')
    .asEnum(['project', 'chat', 'app'])
    .execute();

  await db.schema
    .createTable('permissions')
    .$call(addIdColumn)
    .$call(addTimestampColumns)

    .addColumn('project_id', 'integer', col => col.references('projects.id').onDelete('restrict'))
    .addColumn('app_id', 'integer', col => col.references('apps.id').onDelete('restrict'))
    .addColumn('chat_id', 'uuid', col => col.references('chats.id').onDelete('restrict'))

    .addColumn('user_id', 'integer', col => col.references('users.id').onDelete('restrict'))
    .addColumn('group_id', 'integer', col => col.references('users_groups.id').onDelete('restrict'))
    .addColumn('access_level', sql`permission_level`, col => col.notNull())
    .addCheckConstraint(
      'user_xor_group_check',
      sql`COALESCE((user_id IS NOT NULL)::int, 0) + COALESCE((group_id IS NOT NULL)::int, 0) = 1`,
    )
    .addCheckConstraint(
      'resource_xor_group_check',
      sql`COALESCE((project_id IS NOT NULL)::int, 0) + COALESCE((app_id IS NOT NULL)::int, 0) + COALESCE((chat_id IS NOT NULL)::int, 0) = 1`,
    )
    .addUniqueConstraint(
      'uniq_user_group_permission',
      ['project_id', 'app_id', 'chat_id', 'user_id', 'group_id'],
    )
    .execute();

  await db.schema
    .createIndex('idx_permissions_user_id')
    .on('permissions')
    .column('user_id')
    .execute();

  await db.schema
    .createIndex('idx_permissions_group_id')
    .on('permissions')
    .column('group_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('permissions').execute();
  await db.schema.dropType('permission_resource_type').execute();
  await db.schema.dropType('permission_level').execute();
}
