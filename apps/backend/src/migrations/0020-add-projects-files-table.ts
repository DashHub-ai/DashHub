import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('projects_files')
    .addColumn('project_id', 'integer', col => col.notNull().references('projects.id').onDelete('cascade'))
    .addColumn('s3_resource_id', 'integer', col => col.notNull().references('s3_resources.id').onDelete('cascade'))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('projects_files').execute();
}
