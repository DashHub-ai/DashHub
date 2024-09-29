import type { ReaderTaskEither } from 'fp-ts/lib/ReaderTaskEither';

import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { DatabaseTablesWithId } from '../database.tables';
import type { DatabaseError, DatabaseTE } from '../errors';
import type { NormalizeInsertTableRow, TableRowWithId } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseRecordAlreadyExists } from '../errors';
import { type TransactionalAttrs, type TransactionError, tryReuseOrCreateTransaction } from '../transaction';
import { createRecordInsertQuery } from './create-record-insert.query';

/**
 * Checks if record is available - if so raises exception.
 *
 * @example
 *  readonly createVenueIfNotExists = createRecordInsertIfNotExistsQuery({
 *    table: 'dashboard.venues',
 *    db: this.connection.db,
 *  })(({ forwardTransaction, value }) =>
 *    this.isVenueAvailable({
 *      forwardTransaction,
 *      name: value.name,
 *    }),
 *  );
 *
 *  ...
 *
 *  pipe(
 *    createVenueIfNotExists({
 *      name: 'XYZ
 *    })
 *  )
 */
export function createRecordInsertIfNotExistsQuery<K extends keyof DatabaseTablesWithId>(factoryAttrs: QueryBasicFactoryAttrs<K>) {
  return (
    ifExists: ReaderTaskEither<
      TransactionalAttrs<{
        value: NormalizeInsertTableRow<DatabaseTablesWithId[K]>;
      }>,
      DatabaseError | DatabaseRecordAlreadyExists,
      boolean
    >,
  ) =>
    ({
      forwardTransaction,
      value,
    }: TransactionalAttrs<{
      value: NormalizeInsertTableRow<DatabaseTablesWithId[K]>;
    }>): DatabaseTE<TableRowWithId, DatabaseRecordAlreadyExists | TransactionError> => {
      const transaction = tryReuseOrCreateTransaction({
        db: factoryAttrs.db,
        forwardTransaction,
      });

      return transaction(trx =>
        pipe(
          ifExists({
            value,
            forwardTransaction: trx,
          }),
          TE.chain((exists): DatabaseTE<TableRowWithId, DatabaseRecordAlreadyExists> => {
            if (exists) {
              return TE.left(new DatabaseRecordAlreadyExists({}));
            }

            return createRecordInsertQuery(factoryAttrs)({
              forwardTransaction: trx,
              value,
            });
          }),
        ),
      );
    };
}
