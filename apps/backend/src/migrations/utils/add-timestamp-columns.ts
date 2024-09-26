/* DO NOT CHANGE! It will break migrations! */
import {
  type AlterTableBuilder,
  type AlterTableColumnAlteringBuilder,
  type CreateTableBuilder,
  sql,
} from 'kysely';

export function addTimestampColumns<
  C extends AlterTableBuilder | CreateTableBuilder<any>,
  R = C extends AlterTableBuilder
    ? AlterTableColumnAlteringBuilder
    : CreateTableBuilder<any>,
>(qb: C) {
  return qb
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`NOW()`))
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`NOW()`)) as unknown as R;
}

export function dropTimestampColumns<C extends AlterTableBuilder>(qb: C) {
  return qb.dropColumn('created_at').dropColumn('updated_at');
}
