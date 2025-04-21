import { type Kysely, sql } from 'kysely';

import {
  addArchivedAtColumns,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('ai_external_apis')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('organization_id', 'integer', col => col.notNull().references('organizations.id').onDelete('restrict'))
    .addColumn('name', 'text', col => col.notNull())
    .addColumn('logo_s3_resource_id', 'integer', col => col.references('s3_resources.id').onDelete('restrict'))
    .addColumn('description', 'text')
    .addColumn('schema', 'jsonb', col => col.notNull().defaultTo('{}'))
    .execute();

  await db.schema
    .alterTable('permissions')
    .dropConstraint('resource_xor_group_check')
    .execute();

  await db.schema
    .alterTable('permissions')
    .dropConstraint('uniq_user_group_permission')
    .execute();

  await db.schema
    .alterTable('permissions')
    .addColumn('ai_external_api_id', 'integer', col => col.references('ai_external_apis.id').onDelete('restrict'))
    .execute();

  await db.schema
    .alterTable('permissions')
    .addCheckConstraint(
      'resource_xor_group_check',
      sql`COALESCE((project_id IS NOT NULL)::int, 0) + COALESCE((app_id IS NOT NULL)::int, 0) + COALESCE((chat_id IS NOT NULL)::int, 0) + COALESCE((ai_external_api_id IS NOT NULL)::int, 0) = 1`,
    )
    .execute();

  await db.schema
    .alterTable('permissions')
    .addUniqueConstraint(
      'uniq_user_group_permission',
      ['project_id', 'app_id', 'chat_id', 'ai_external_api_id', 'user_id', 'group_id'],
    )
    .execute();

  await db.schema
    .createIndex('ai_external_apis_organization_id_index')
    .on('ai_external_apis')
    .column('organization_id')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('permissions')
    .dropConstraint('resource_xor_group_check')
    .execute();

  await db.schema
    .alterTable('permissions')
    .dropConstraint('uniq_user_group_permission')
    .execute();

  await db.schema
    .alterTable('permissions')
    .dropColumn('ai_external_api_id')
    .execute();

  await db.schema
    .alterTable('permissions')
    .addCheckConstraint(
      'resource_xor_group_check',
      sql`COALESCE((project_id IS NOT NULL)::int, 0) + COALESCE((app_id IS NOT NULL)::int, 0) + COALESCE((chat_id IS NOT NULL)::int, 0) = 1`,
    )
    .execute();

  await db.schema
    .alterTable('permissions')
    .addUniqueConstraint(
      'uniq_user_group_permission',
      ['project_id', 'app_id', 'chat_id', 'user_id', 'group_id'],
    )
    .execute();

  await db.schema.dropTable('ai_external_apis').execute();
}
