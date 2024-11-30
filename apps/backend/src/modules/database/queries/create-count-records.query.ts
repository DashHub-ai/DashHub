import type { SelectQueryBuilder } from 'kysely';

import type { DatabaseTables } from '../database.tables';
import type { KyselySelectCreator } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseError, type DatabaseTE } from '../errors';
import { type TransactionalAttrs, tryReuseTransactionOrSkip } from '../transaction';
import {
  createWhereSelectQuery,
  type WhereQueryBuilderAttrs,
} from './create-select-where.query';

export type CreateCountRecordsQueryAttrs<
  K extends keyof DatabaseTables,
  Q = KyselySelectCreator<K>,
> = WhereQueryBuilderAttrs<K> &
TransactionalAttrs<{
  limit?: number;
  modifyQuery?: (query: Q) => SelectQueryBuilder<DatabaseTables, any, any>;
}>;

export function createCountRecordsQuery<K extends keyof DatabaseTables>({ table, db }: QueryBasicFactoryAttrs<K>) {
  return (
    attrs: CreateCountRecordsQueryAttrs<K> = {},
  ): DatabaseTE<number> => {
    const {
      forwardTransaction,
      modifyQuery,
      where = [],
      limit,
    } = attrs;

    const transaction = tryReuseTransactionOrSkip({ db, forwardTransaction });
    const query = transaction(async qb =>
      qb
        .selectFrom(table)
        .select(({ fn }) => fn.count<number>('*' as any).as('count'))
        .$call((nqb) => {
          if (modifyQuery) {
            return modifyQuery(nqb as any);
          }

          return nqb;
        })
        .$call(createWhereSelectQuery({ where }))
        .$call(nestedQuery => (limit ? nestedQuery.limit(limit) : nestedQuery))
        .executeTakeFirst()
        .then(result => result.count as number),
    );

    return DatabaseError.tryTask(query);
  };
}
