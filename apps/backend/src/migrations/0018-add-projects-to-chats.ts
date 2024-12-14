import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chats')
    .addColumn('project_id', 'integer', col => col.references('projects.id').onDelete('restrict'))
    .execute();

  await db.schema
    .createIndex('chats_project_id_index')
    .on('chats')
    .columns(['project_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('chats')
    .dropColumn('project_id')
    .execute();
}
