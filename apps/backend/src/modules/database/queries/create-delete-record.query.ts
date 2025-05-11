import { pipe } from 'fp-ts/lib/function';

import { toVoidTE } from '@dashhub/commons';

import type { DatabaseTablesWithId } from '../database.tables';
import type { TableId } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseError, type DatabaseTE } from '../errors';
import { type TransactionalAttrs, tryReuseTransactionOrSkip } from '../transaction';

/**
 * Creates query that deletes specified object
 *
 * @see
 *  If transaction provided then it reuses it!
 *
 * @example
 *  const deleteUser = createDeleteRecordQuery({ table: 'dashboard.users', db });
 *
 *  pipe(
 *    deleteUser({ id: 123, forwardTransaction?: <xyz> }),
 *    TE.map(...),
 *  );
 */
export function createDeleteRecordQuery<K extends keyof DatabaseTablesWithId>({
  table,
  db,
}: QueryBasicFactoryAttrs<K>) {
  return ({
    forwardTransaction,
    id,
  }: TransactionalAttrs<{ id: TableId; }>): DatabaseTE<void> => {
    const transaction = tryReuseTransactionOrSkip({ db, forwardTransaction });
    const recordAvailabilityTask = transaction(async qb =>
      qb
        .deleteFrom(table)
        .where('id', '=', id as any)
        .execute(),
    );

    return pipe(
      recordAvailabilityTask,
      DatabaseError.tryTask,
      toVoidTE,
    );
  };
}
