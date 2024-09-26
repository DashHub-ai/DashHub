/* DO NOT CHANGE! It will break migrations! */
import type { AlterTableBuilder, CreateTableBuilder } from 'kysely';

export function addIdColumn<
  C extends AlterTableBuilder | CreateTableBuilder<any>,
>(qb: C) {
  return qb.addColumn('id', 'serial', col => col.primaryKey()) as C;
}

export function dropIdColumn<C extends AlterTableBuilder>(qb: C) {
  return qb.dropColumn('id');
}
