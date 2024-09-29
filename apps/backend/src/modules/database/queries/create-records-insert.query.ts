import { nonEmptyArray as NEA, option as O } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import snakeCaseKeys from 'snakecase-keys';

import type { DatabaseTablesWithId } from '../database.tables';
import type { KyselyQueryCreator, NormalizeInsertTableRow, TableRowWithId } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseError, type DatabaseTE } from '../errors';
import { type TransactionalAttrs, tryReuseTransactionOrSkip } from '../transaction';

/**
 * Inserts multiple records into table and returns ids.
 *
 * @see
 *  If transaction provided then it reuses it!
 *
 * @example
 *  const insertQueryTask = createRecordsQuery({ table: 'dashboard.users', db });
 *
 *  pipe(
 *    insertQueryTask({
 *      values: [{ ... }]
 *    }),
 *    TE.map(...),
 *  );
 */

export function createRecordsInsertQuery<K extends keyof DatabaseTablesWithId>({
  table,
  db,
}: QueryBasicFactoryAttrs<K>) {
  return ({
    forwardTransaction,
    values,
  }: TransactionalAttrs<{
    values: NEA.NonEmptyArray<NormalizeInsertTableRow<DatabaseTablesWithId[K]>>;
  }>): DatabaseTE<NEA.NonEmptyArray<TableRowWithId>> => {
    const createRecordTask = async (qb: KyselyQueryCreator) => {
      const insertedRows = await qb
        .insertInto(table)
        .values(values.map(obj => snakeCaseKeys(obj as any)) as any)
        .returning('id')
        .execute();

      const items = NEA.fromArray(
        insertedRows.map(item => ({
          id: item.id as number,
        })),
      );

      if (O.isNone(items)) {
        throw new Error('Incorrect number of inserted records!');
      }

      return items.value;
    };

    const transaction = tryReuseTransactionOrSkip({
      db,
      forwardTransaction,
    });

    return pipe(transaction(createRecordTask), DatabaseError.tryTask);
  };
}
