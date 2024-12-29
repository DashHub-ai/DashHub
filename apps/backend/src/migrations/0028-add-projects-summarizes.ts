import type { Kysely } from 'kysely';

import {
  addAIGeneratedColumns,
  addIdColumn,
  addTimestampColumns,
} from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('projects')
    .dropColumn('description')
    .execute();

  await db.schema
    .createTable('projects_summaries')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addAIGeneratedColumns('content'))
    .addColumn('project_id', 'integer', col => col.notNull().references('projects.id').onDelete('restrict'))
    .addColumn('last_summarized_message_id', 'uuid', col => col.references('messages.id').onDelete('restrict'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('projects')
    .addColumn('description', 'text')
    .execute();

  await db.schema.dropTable('projects_summaries').execute();
}
