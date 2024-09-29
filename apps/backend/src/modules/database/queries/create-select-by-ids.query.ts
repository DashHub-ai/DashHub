import type { SelectType } from 'kysely';

import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { DatabaseTablesWithId } from '../database.tables';
import type { NormalizeSelectTableRow } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseError, type DatabaseTE } from '../errors/database.error';
import { type TransactionalAttrs, tryReuseTransactionOrSkip } from '../transaction';

export type SelectByIdsQueryAttrs<K extends keyof DatabaseTablesWithId> =
  TransactionalAttrs & {
    ids: Array<SelectType<DatabaseTablesWithId[K]['id']>>;
  };

export function createSelectByIdsQuery<K extends keyof DatabaseTablesWithId>({
  table,
  db,
}: QueryBasicFactoryAttrs<K>) {
  return ({
    forwardTransaction,
    ids,
  }: SelectByIdsQueryAttrs<K>): DatabaseTE<
    Array<NormalizeSelectTableRow<DatabaseTablesWithId[K]>>
  > => {
    const transaction = tryReuseTransactionOrSkip({ db, forwardTransaction });
    const recordAvailabilityTask = transaction(async (qb) => {
      if (!ids.length) {
        return [];
      }

      return qb
        .selectFrom(table)
        .$call(nqb =>
          ids.length > 1
            ? nqb.where('id', 'in', ids as any).limit(ids.length)
            : nqb.where('id', '=', ids[0] as any),
        )
        .selectAll()
        .execute();
    });

    return pipe(
      recordAvailabilityTask,
      DatabaseError.tryTask,
      TE.map(A.map(obj => camelcaseKeys(obj as any, { deep: true }))),
    );
  };
}
