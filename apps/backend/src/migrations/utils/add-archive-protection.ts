/* DO NOT CHANGE! It will break migrations! */
import {
  type AlterTableBuilder,
  type AlterTableColumnAlteringBuilder,
  type CreateTableBuilder,
  sql,
} from 'kysely';

export function addArchiveProtectionColumn<
  C extends AlterTableBuilder | CreateTableBuilder<any>,
  R = C extends AlterTableBuilder
    ? AlterTableColumnAlteringBuilder
    : CreateTableBuilder<any>,
>(qb: C) {
  return qb.addColumn('archive_protection', 'boolean', col =>
    col.check(sql`(archived_at is null or archive_protection is not true)`)) as unknown as R;
}

export function dropArchiveProtectionColumn<C extends AlterTableBuilder>(qb: C) {
  return qb.dropColumn('archive_protection');
}
