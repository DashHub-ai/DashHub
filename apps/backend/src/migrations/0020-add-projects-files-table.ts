import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('projects_files')
    .addColumn('project_id', 'integer', col => col.notNull().references('projects.id').onDelete('cascade'))
    .addColumn('s3_resource_id', 'integer', col => col.notNull().references('s3_resources.id').onDelete('cascade'))
    .execute();

  await db.schema
    .createIndex('project_files_project_id_s3_resource_id_unique')
    .on('projects_files')
    .columns(['project_id', 's3_resource_id'])
    .unique()
    .execute();

  await db.schema
    .createIndex('project_files_project_id')
    .on('projects_files')
    .columns(['project_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('projects_files').execute();
}
