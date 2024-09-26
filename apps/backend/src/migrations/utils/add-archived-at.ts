/* DO NOT CHANGE! It will break migrations! */
import {
  type AlterTableBuilder,
  type AlterTableColumnAlteringBuilder,
  type CreateTableBuilder,
  sql,
} from 'kysely';

export function addArchivedAtColumns<
  C extends AlterTableBuilder | CreateTableBuilder<any>,
  R = C extends AlterTableBuilder
    ? AlterTableColumnAlteringBuilder
    : CreateTableBuilder<any>,
>(qb: C) {
  return qb
    .addColumn('archived_at', 'timestamptz')
    .addColumn('archived', 'boolean', col =>
      col
        .generatedAlwaysAs(sql`archived_at is not null`)
        .stored()
        .notNull()) as unknown as R;
}

export function dropArchivedAtColumns<C extends AlterTableBuilder>(qb: C) {
  return qb.dropColumn('archived').dropColumn('archived_at');
}
