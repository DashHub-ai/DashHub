import type { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('organizations_ai_settings')
    .addColumn('project_id', 'integer', col => col.references('projects.id').onDelete('restrict'))
    .execute();

  const organizations = await db
    .selectFrom('organizations_ai_settings')
    .select(['organization_id as id'])
    .execute();

  const rootUser = await db
    .selectFrom('users')
    .select(['id'])
    .where('role', '=', 'root')
    .executeTakeFirst();

  if (rootUser) {
    for (const [index, organization] of organizations.entries()) {
      const project = await db
        .insertInto('projects')
        .values({
          name: `Migrated Organization Project - ${Date.now()}-${index}`,
          organization_id: organization.id,
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
        .updateTable('organizations_ai_settings')
        .set({ project_id: project.id })
        .where('organization_id', '=', organization.id)
        .execute();
    }
  }

  await db.schema
    .alterTable('organizations_ai_settings')
    .alterColumn('project_id', col => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  const projects = await db
    .selectFrom('organizations_ai_settings')
    .select(['project_id'])
    .where('project_id', 'is not', null)
    .execute();

  await db.schema
    .alterTable('organizations_ai_settings')
    .dropColumn('project_id')
    .execute();

  if (projects.length > 0) {
    await db
      .deleteFrom('projects_summaries')
      .where('project_id', 'in', projects.map(app => app.project_id))
      .execute();

    await db
      .deleteFrom('projects')
      .where('id', 'in', projects.map(app => app.project_id))
      .execute();
  }
}
