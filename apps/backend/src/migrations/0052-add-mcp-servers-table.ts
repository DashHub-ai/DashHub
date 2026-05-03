import type { Kysely } from 'kysely';

import { addArchivedAtColumns, addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('mcp_servers')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('organization_id', 'integer', col =>
      col.notNull().references('organizations.id').onDelete('cascade'))
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('description', 'text')
    .addColumn('url', 'varchar', col => col.notNull())
    .addColumn('enabled', 'boolean', col => col.notNull().defaultTo(true))
    .execute();

  await db.schema
    .createIndex('mcp_servers_organization_id_idx')
    .on('mcp_servers')
    .column('organization_id')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('mcp_servers').execute();
}
