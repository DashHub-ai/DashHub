import { type Kysely, sql } from 'kysely';

import {
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('projects_embeddings')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('text', 'text', col => col.notNull())
    .addColumn('project_file_id', 'integer', col => col.references('projects_files.id').notNull())
    .addColumn('vector', sql`vector(1536)`, col => col.notNull())
    .addColumn('metadata', 'jsonb')
    .addColumn('summary', 'boolean', col => col.defaultTo(false).notNull())
    .execute();

  await db.schema
    .createIndex('projects_embeddings_project_id_index')
    .on('projects_embeddings')
    .column('project_file_id')
    .execute();

  await db.schema
    .createIndex('projects_embeddings_summary_index')
    .on('projects_embeddings')
    .column('summary')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('projects_embeddings').execute();
}
