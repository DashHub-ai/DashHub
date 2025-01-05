import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    alter type organization_role add value 'tech';
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    update organizations_users set role = 'member' where role = 'tech';
    alter type organization_role rename to organization_role_old;
    create type organization_role as enum('owner', 'member');
    alter table organizations_users
        alter column role drop default,
        alter column role type organization_role using role::text::organization_role;
    drop type organization_role_old;
  `.execute(db);
}
