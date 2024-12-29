import { type Kysely, sql } from 'kysely';

import { addArchivedAtColumns, addIdColumn, addTimestampColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_groups')
    .$call(addIdColumn)
    .$call(addTimestampColumns)
    .$call(addArchivedAtColumns)
    .addColumn('organization_id', 'integer', col => col.notNull().references('organizations.id').onDelete('restrict'))
    .addColumn('creator_user_id', 'integer', col => col.notNull().references('users.id').onDelete('restrict'))
    .addColumn('name', 'text', col => col.notNull())
    .execute();

  await db.schema
    .createTable('users_groups_users')
    .addColumn('user_id', 'integer', col => col.notNull().references('users.id').onDelete('cascade'))
    .addColumn('group_id', 'integer', col => col.notNull().references('users_groups.id').onDelete('cascade'))
    .addUniqueConstraint('user_id_group_id_unique', ['user_id', 'group_id'])
    .execute();

  await db.schema
    .createIndex('users_groups_organization_id_index')
    .on('users_groups')
    .column('organization_id')
    .execute();

  await sql`
    CREATE OR REPLACE FUNCTION users_groups_users_check_organization() RETURNS TRIGGER AS $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM organizations_users ou
        JOIN users_groups ug ON ug.organization_id = ou.organization_id
        WHERE ou.user_id = NEW.user_id
        AND ug.id = NEW.group_id
      ) THEN
        RAISE EXCEPTION 'User must belong to the same organization as the group';
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER users_groups_users_organization_check
    BEFORE INSERT OR UPDATE ON users_groups_users
    FOR EACH ROW
    EXECUTE FUNCTION users_groups_users_check_organization();
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    DROP TRIGGER IF EXISTS users_groups_users_organization_check ON users_groups_users;
    DROP FUNCTION IF EXISTS users_groups_users_check_organization();
  `.execute(db);

  await db.schema.dropTable('users_groups_users').execute();
  await db.schema.dropTable('users_groups').execute();
}
