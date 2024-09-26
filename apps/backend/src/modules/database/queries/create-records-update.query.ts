import { pipe } from 'fp-ts/function';
import snakecaseKeys from 'snakecase-keys';

import type { DatabaseTablesWithId } from '../database.tables';
import type {
  KyselyQueryCreator,
  NormalizeUpdateTableRow,
  TableRowWithId,
} from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseError, type DatabaseTE } from '../errors/database.error';
import { type TransactionalAttrs, tryReuseTransactionOrSkip } from '../transaction';
import {
  createWhereSelectQuery,
  type WhereQueryBuilderAttrs,
} from './create-select-where.query';

export type RecordsUpdateTableRow<K extends keyof DatabaseTablesWithId> =
  TransactionalAttrs &
  WhereQueryBuilderAttrs<K> & {
    value: Partial<NormalizeUpdateTableRow<DatabaseTablesWithId[K]>>;
    tapUpdatedAt?: boolean;
  };

export function createRecordsUpdateQuery<K extends keyof DatabaseTablesWithId>({
  table,
  db,
}: QueryBasicFactoryAttrs<K>) {
  return ({
    value,
    where,
    tapUpdatedAt = true,
    forwardTransaction,
  }: RecordsUpdateTableRow<K>): DatabaseTE<TableRowWithId[]> => {
    const createRecordTask = async (qb: KyselyQueryCreator) =>
      qb
        .updateTable(table)
        .$call(nqb => createWhereSelectQuery({ where })(nqb as any))
        .set(
          snakecaseKeys(
            {
              ...value,
              ...(tapUpdatedAt && {
                updated_at: new Date(),
              }),
            },
            { deep: false },
          ) as any,
        )
        .returning('id')
        .execute();

    const transaction = tryReuseTransactionOrSkip({
      db,
      forwardTransaction,
    });

    return pipe(transaction(createRecordTask), DatabaseError.tryTask);
  };
}
