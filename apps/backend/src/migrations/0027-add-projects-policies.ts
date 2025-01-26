import { type Kysely, sql } from 'kysely';

import { addArchivedAtColumns, addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  // Create projects_policies table
  await db.schema
    .createType('project_access_level')
    .asEnum(['read', 'write', 'admin'])
    .execute();

  await db.schema
    .createTable('projects_policies')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('project_id', 'integer', col => col.notNull().references('projects.id').onDelete('restrict'))
    .addColumn('user_id', 'integer', col => col.references('users.id').onDelete('restrict'))
    .addColumn('group_id', 'integer', col => col.references('users_groups.id').onDelete('restrict'))
    .addColumn('level', sql`project_access_level`, col => col.notNull())
    .addCheckConstraint(
      'user_xor_group_check',
      sql`COALESCE((user_id IS NOT NULL)::int, 0) + COALESCE((group_id IS NOT NULL)::int, 0) = 1`,
    )
    .addUniqueConstraint('project_id_user_id_group_id_unique', ['project_id', 'user_id', 'group_id'])
    .execute();

  // Create validation triggers
  await sql`
    CREATE OR REPLACE FUNCTION projects_policies_check_user_organization() RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.user_id IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM organizations_users ou
        JOIN projects p ON p.id = NEW.project_id
        WHERE ou.user_id = NEW.user_id
        AND ou.organization_id = p.organization_id
      ) THEN
        RAISE EXCEPTION 'User must belong to the project organization';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER projects_policies_user_organization_check
    BEFORE INSERT OR UPDATE ON projects_policies
    FOR EACH ROW
    EXECUTE FUNCTION projects_policies_check_user_organization();

    CREATE OR REPLACE FUNCTION projects_policies_check_group_organization() RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.group_id IS NOT NULL AND NOT EXISTS (
        SELECT 1
        FROM users_groups ug
        JOIN projects p ON p.id = NEW.project_id
        WHERE ug.id = NEW.group_id
        AND ug.organization_id = p.organization_id
      ) THEN
        RAISE EXCEPTION 'Group must belong to the project organization';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER projects_policies_group_organization_check
    BEFORE INSERT OR UPDATE ON projects_policies
    FOR EACH ROW
    EXECUTE FUNCTION projects_policies_check_group_organization();
  `.execute(db);

  // Alter projects table to add creator_user_id column
  await db.schema
    .alterTable('projects')
    .addColumn('creator_user_id', 'integer', col => col.references('users.id').onDelete('restrict'))
    .execute();

  const rootUser = await db
    .selectFrom('users')
    .select(['id'])
    .where('role', '=', 'root')
    .executeTakeFirst();

  if (rootUser) {
    await db
      .updateTable('projects')
      .set({ creator_user_id: rootUser.id })
      .execute();
  }

  await db.schema
    .alterTable('projects')
    .alterColumn('creator_user_id', col => col.setNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP TRIGGER IF EXISTS projects_policies_user_organization_check ON projects_policies;
    DROP FUNCTION IF EXISTS projects_policies_check_user_organization();

    DROP TRIGGER IF EXISTS projects_policies_group_organization_check ON projects_policies;
    DROP FUNCTION IF EXISTS projects_policies_check_group_organization();
  `.execute(db);

  await db.schema.alterTable('projects').dropColumn('creator_user_id').execute();
  await db.schema.dropTable('projects_policies').execute();
  await db.schema.dropType('project_access_level').execute();
}
