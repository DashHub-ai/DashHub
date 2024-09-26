import { pipe } from 'fp-ts/function';

import { toVoidTE } from '@llm/commons';

import type { DatabaseTablesWithId } from '../database.tables';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseError, type DatabaseTE } from '../errors';
import { type TransactionalAttrs, tryReuseTransactionOrSkip } from '../transaction';
import {
  createWhereSelectQuery,
  type WhereQueryBuilderAttrs,
} from './create-select-where.query';

export function createDeleteRecordsQuery<K extends keyof DatabaseTablesWithId>({
  table,
  db,
}: QueryBasicFactoryAttrs<K>) {
  return ({
    forwardTransaction,
    where,
  }: TransactionalAttrs<Required<WhereQueryBuilderAttrs<K>>>): DatabaseTE<void> => {
    const transaction = tryReuseTransactionOrSkip({ db, forwardTransaction });
    const recordAvailabilityTask = transaction(async (qb: any) =>
      qb
        .deleteFrom(table)
        .$call(createWhereSelectQuery({ where }) as any)
        .execute(),
    );

    return pipe(recordAvailabilityTask, DatabaseError.tryTask, toVoidTE);
  };
}
