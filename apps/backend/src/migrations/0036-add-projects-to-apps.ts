import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('apps')
    .addColumn('project_id', 'integer', col => col.references('projects.id').onDelete('restrict'))
    .execute();

  await db.schema
    .createIndex('apps_project_id_index')
    .on('apps')
    .columns(['project_id'])
    .execute();

  const apps = await db
    .selectFrom('apps')
    .select(['id', 'organization_id'])
    .execute();

  const rootUser = await db
    .selectFrom('users')
    .select(['id'])
    .where('role', '=', 'root')
    .executeTakeFirst();

  if (rootUser) {
    for (const [index, app] of apps.entries()) {
      const project = await db
        .insertInto('projects')
        .values({
          name: `Migrated App Project - ${Date.now()}-${index}`,
          organization_id: app.organization_id,
          internal: true,
          creator_user_id: rootUser.id,
        })
        .returning(['id'])
        .executeTakeFirstOrThrow();

      await db
        .insertInto('projects_summaries')
        .values({
          project_id: project.id,
        })
        .execute();

      await db
        .updateTable('apps')
        .set({ project_id: project.id })
        .where('id', '=', app.id)
        .execute();
    }
  }

  await db.schema
    .alterTable('apps')
    .alterColumn('project_id', col => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  const apps = await db
    .selectFrom('apps')
    .select(['project_id'])
    .where('project_id', 'is not', null)
    .execute();

  await db.schema
    .alterTable('apps')
    .dropColumn('project_id')
    .execute();

  if (apps.length > 0) {
    await db
      .deleteFrom('projects_summaries')
      .where('project_id', 'in', apps.map(app => app.project_id))
      .execute();

    await db
      .deleteFrom('projects')
      .where('id', 'in', apps.map(app => app.project_id))
      .execute();
  }
}
