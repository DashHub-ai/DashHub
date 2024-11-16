/* DO NOT CHANGE! It will break migrations! */
import { type AlterTableBuilder, type CreateTableBuilder, sql } from 'kysely';

export function addUuidColumn<
  C extends AlterTableBuilder | CreateTableBuilder<any>,
>(qb: C) {
  return qb.addColumn('id', 'uuid', col => col.primaryKey().defaultTo(sql`gen_random_uuid()`)) as C;
}

export function dropUuidColumn<C extends AlterTableBuilder>(qb: C) {
  return qb.dropColumn('id');
}
