/* DO NOT CHANGE! It will break migrations! */
import type {
  AlterTableBuilder,
  AlterTableColumnAlteringBuilder,
  CreateTableBuilder,
} from 'kysely';

export function addAIGeneratedColumns<const F extends string>(field: F) {
  return <
    C extends AlterTableBuilder | CreateTableBuilder<any>,
    R = C extends AlterTableBuilder
      ? AlterTableColumnAlteringBuilder
      : CreateTableBuilder<any>,
  >(qb: C) => {
    return qb
      .addColumn(field, 'text')
      .addColumn(`${field}_generated`, 'boolean', col => col.notNull().defaultTo(true))
      .addColumn(`${field}_generated_at`, 'timestamptz') as unknown as R;
  };
};

export function dropAIGeneratedColumns<const F extends string>(field: F) {
  return <C extends AlterTableBuilder>(qb: C) => {
    return qb
      .dropColumn(field)
      .dropColumn(`${field}_generated`)
      .dropColumn(`${field}_generated_at`);
  };
}
