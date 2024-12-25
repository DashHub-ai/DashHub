import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('projects_files')
    .addColumn('message_id', 'uuid', col => col.references('messages.id').onDelete('restrict'))
    .execute();

  await db.schema
    .createIndex('projects_files_message_id_index')
    .on('projects_files')
    .column('message_id')
    .execute();

  await db.schema
    .alterTable('projects')
    .addColumn('internal', 'boolean', col => col.notNull().defaultTo(false))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('projects')
    .dropColumn('internal')
    .execute();

  await db.schema
    .alterTable('projects_files')
    .dropColumn('message_id')
    .execute();
}
