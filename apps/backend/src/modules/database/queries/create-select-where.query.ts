import type {
  ComparisonOperatorExpression,
  OperandValueExpressionOrList,
  ReferenceExpression,
  SelectQueryBuilder,
} from 'kysely';

import { snakeCase } from 'snake-case';

import type { SnakeToCamelCase } from '@llm/commons';

import type { DatabaseTables } from '../database.tables';

export type WhereQueryCondition<DT extends keyof DatabaseTables> = [
  SnakeToCamelCase<ReferenceExpression<DatabaseTables, DT>>,
  ComparisonOperatorExpression,
  OperandValueExpressionOrList<
    DatabaseTables,
    DT,
    ReferenceExpression<DatabaseTables, DT>
  >,
];

export type WhereQueryConditions<DT extends keyof DatabaseTables> = Array<
  WhereQueryCondition<DT>
>;

export type WhereQueryBuilderAttrs<DT extends keyof DatabaseTables> = {
  where?: WhereQueryConditions<DT>;
};

export function createWhereSelectQuery<DT extends keyof DatabaseTables>({
  where = [],
}: WhereQueryBuilderAttrs<DT>) {
  return <Q extends SelectQueryBuilder<any, any, any>>(qb: Q): Q =>
    qb.$call((nestedQuery) => {
      for (const [key, op, value] of where) {
        nestedQuery = nestedQuery.where(
          snakeCase(key as string) as any,
          op,
          value,
        ) as Q;
      }

      return nestedQuery;
    }) as Q;
}
