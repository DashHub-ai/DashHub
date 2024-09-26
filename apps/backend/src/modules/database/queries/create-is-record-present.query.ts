import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { snakeCase } from 'snake-case';

import type { DatabaseTablesWithId } from '../database.tables';
import type { NormalizeSelectTableRow } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseError, type DatabaseTE } from '../errors';
import { type TransactionalAttrs, tryReuseTransactionOrSkip } from '../transaction';

export type IsPresentQueryAttrs<K extends keyof DatabaseTablesWithId> =
  TransactionalAttrs &
  Partial<NormalizeSelectTableRow<DatabaseTablesWithId[K]>>;

/**
 * Creates query that search one record
 *
 * @see
 *  If transaction provided then it reuses it!
 *
 * @example
 *  const isVenuePresent = createIsRecordPresentQuery({ table: 'dashboard.users', db });
 *
 *  pipe(
 *    isVenuePresent({ id: 123, forwardTransaction?: <xyz> }),
 *    TE.map(...),
 *  );
 */
export function createIsRecordPresentQuery<K extends keyof DatabaseTablesWithId>({
  table,
  db,
}: QueryBasicFactoryAttrs<K>) {
  return ({
    forwardTransaction,
    ...fields
  }: IsPresentQueryAttrs<K>): DatabaseTE<boolean> => {
    const transaction = tryReuseTransactionOrSkip({ db, forwardTransaction });
    const recordAvailabilityTask = transaction(async qb =>
      qb
        .selectFrom(table)
        .$call((nestedQuery) => {
          for (const [key, value] of Object.entries(fields)) {
            nestedQuery = nestedQuery.where(snakeCase(key) as any, '=', value);
          }

          return nestedQuery;
        })
        .select(db.fn.count('id').as('total'))
        .executeTakeFirstOrThrow(),
    );

    return pipe(
      recordAvailabilityTask,
      DatabaseError.tryTask,
      TE.map(result => Number(result.total) > 0),
    );
  };
}
