import type { SelectQueryBuilder } from 'kysely';

import camelcaseKeys from 'camelcase-keys';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/lib/TaskEither';
import { snakeCase } from 'snake-case';

import type { DatabaseTables } from '../database.tables';
import type { KyselySelectCreator, NormalizeSelectTableRow } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseError, type DatabaseTE } from '../errors';
import { type TransactionalAttrs, tryReuseTransactionOrSkip } from '../transaction';
import {
  createWhereSelectQuery,
  type WhereQueryBuilderAttrs,
} from './create-select-where.query';

export type CreateSelectRecordsQueryAttrs<
  K extends keyof DatabaseTables,
  S extends keyof NormalizeSelectTableRow<DatabaseTables[K]>,
  Q = KyselySelectCreator<K>,
> = WhereQueryBuilderAttrs<K> &
  TransactionalAttrs<{
    select?: S[];
    limit?: number;
    modifyQuery?: (query: Q) => SelectQueryBuilder<DatabaseTables, any, any>;
  }>;

export function createSelectRecordsQuery<K extends keyof DatabaseTables>({ table, db }: QueryBasicFactoryAttrs<K>) {
  return <S extends keyof NormalizeSelectTableRow<DatabaseTables[K]>>(
    attrs: CreateSelectRecordsQueryAttrs<K, S> = {},
  ): DatabaseTE<Array<Pick<NormalizeSelectTableRow<DatabaseTables[K]>, S>>> => {
    const {
      forwardTransaction,
      modifyQuery,
      select,
      where = [],
      limit,
    } = attrs;

    const transaction = tryReuseTransactionOrSkip({ db, forwardTransaction });
    const query = transaction(async qb =>
      qb
        .selectFrom(table)
        .$call((nqb) => {
          if (select) {
            return nqb.select(
              select.map(field => snakeCase(field as string)) as unknown as any,
            );
          }

          return nqb.selectAll();
        })
        .$call((nqb) => {
          if (modifyQuery) {
            return modifyQuery(nqb as any);
          }

          return nqb;
        })
        .$call(createWhereSelectQuery({ where }))
        .$call(nestedQuery => (limit ? nestedQuery.limit(limit) : nestedQuery))
        .execute(),
    );

    return pipe(
      query,
      DatabaseError.tryTask,
      TE.map(obj => camelcaseKeys(obj, { deep: true })),
    ) as any;
  };
}
