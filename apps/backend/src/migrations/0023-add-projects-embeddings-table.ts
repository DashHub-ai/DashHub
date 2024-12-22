import { type Kysely, sql } from 'kysely';

import {
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('ai_models')
    .addColumn('embedding', 'boolean', col => col.defaultTo(false).notNull())
    .execute();

  await db.schema
    .createTable('projects_embeddings')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('text', 'text', col => col.notNull())
    .addColumn('project_file_id', 'integer', col => col.references('projects_files.id').notNull().onDelete('cascade'))
    .addColumn('vector', sql`vector`, col => col.notNull())
    .addColumn('ai_model_id', 'integer', col => col.references('ai_models.id').notNull())
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
  await db.schema.alterTable('ai_models').dropColumn('embedding').execute();
}
