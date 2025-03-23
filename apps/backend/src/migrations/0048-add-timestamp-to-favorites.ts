import type { Kysely } from 'kysely';

import { addTimestampColumns, dropTimestampColumns } from './utils';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users_favorites')
    .$call(addTimestampColumns)
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('users_favorites')
    .$call(dropTimestampColumns)
    .execute();
}
