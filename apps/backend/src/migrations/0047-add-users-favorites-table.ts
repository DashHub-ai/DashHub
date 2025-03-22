import { type Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('users_favorites')
    .addColumn('user_id', 'integer', col => col.references('users.id').notNull().onDelete('cascade'))
    .addColumn('app_id', 'integer', col => col.references('apps.id').onDelete('cascade'))
    .addColumn('chat_id', 'uuid', col => col.references('chats.id').onDelete('cascade'))
    .addCheckConstraint(
      'only_one_resource_xor_check',
      sql`COALESCE((app_id IS NOT NULL)::int, 0) + COALESCE((chat_id IS NOT NULL)::int, 0) = 1`,
    )
    .execute();

  await db.schema
    .createIndex('users_favorites_unique_index')
    .on('users_favorites')
    .unique()
    .columns(['user_id', 'app_id', 'chat_id'])
    .execute();

  await db.schema
    .createIndex('users_favorites_user_id_index')
    .on('users_favorites')
    .columns(['user_id'])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('users_favorites').execute();
}
