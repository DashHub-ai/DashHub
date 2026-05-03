import type { Kysely } from 'kysely';

import { addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('eval_suites')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('organization_id', 'integer', col =>
      col.notNull().references('organizations.id').onDelete('cascade'))
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('description', 'text')
    .execute();

  await db.schema
    .createIndex('eval_suites_organization_id_idx')
    .on('eval_suites')
    .column('organization_id')
    .execute();

  await db.schema
    .createTable('eval_cases')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('suite_id', 'integer', col =>
      col.notNull().references('eval_suites.id').onDelete('cascade'))
    .addColumn('input_message', 'text', col => col.notNull())
    .addColumn('expected_note', 'text')
    .execute();

  await db.schema
    .createIndex('eval_cases_suite_id_idx')
    .on('eval_cases')
    .column('suite_id')
    .execute();

  await db.schema
    .createTable('eval_runs')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('suite_id', 'integer', col =>
      col.notNull().references('eval_suites.id').onDelete('cascade'))
    .addColumn('ai_model_id', 'integer', col =>
      col.notNull().references('ai_models.id').onDelete('cascade'))
    .addColumn('status', 'varchar', col => col.notNull().defaultTo('pending'))
    .execute();

  await db.schema
    .createIndex('eval_runs_suite_id_idx')
    .on('eval_runs')
    .column('suite_id')
    .execute();

  await db.schema
    .createTable('eval_results')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .addColumn('run_id', 'integer', col =>
      col.notNull().references('eval_runs.id').onDelete('cascade'))
    .addColumn('case_id', 'integer', col =>
      col.notNull().references('eval_cases.id').onDelete('cascade'))
    .addColumn('ai_response', 'text')
    .addColumn('latency_ms', 'integer')
    .addColumn('error_message', 'text')
    .execute();

  await db.schema
    .createIndex('eval_results_run_id_idx')
    .on('eval_results')
    .column('run_id')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('eval_results').execute();
  await db.schema.dropTable('eval_runs').execute();
  await db.schema.dropTable('eval_cases').execute();
  await db.schema.dropTable('eval_suites').execute();
}
