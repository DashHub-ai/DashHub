import type { SelectType } from 'kysely';

import { pipe } from 'fp-ts/lib/function';
import * as NEA from 'fp-ts/lib/NonEmptyArray';
import * as TE from 'fp-ts/lib/TaskEither';

import type { DatabaseTablesWithId } from '../database.tables';
import type { DatabaseTE } from '../errors';
import type { TransactionalAttrs } from '../transaction';
import type { NormalizeInsertTableRow } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { createRecordsInsertQuery } from './create-records-insert.query';

/**
 * Inserts single record into table and return id.
 *
 * @see
 *  If transaction provided then it reuses it!
 *
 * @example
 *  const insertQueryTask = createRecordInsertQuery({ table: 'dashboard.users', db });
 *
 *  pipe(
 *    insertQueryTask({
 *      value: { ... }
 *    }),
 *    TE.map(...),
 *  );
 */
export function createRecordInsertQuery<K extends keyof DatabaseTablesWithId>(factoryAttrs: QueryBasicFactoryAttrs<K>) {
  return ({
    value,
    ...attrs
  }: TransactionalAttrs<{
    value: NormalizeInsertTableRow<DatabaseTablesWithId[K]>;
  }>): DatabaseTE<{ id: SelectType<DatabaseTablesWithId[K]['id']>; }> =>
    pipe(
      createRecordsInsertQuery(factoryAttrs)({
        values: [value],
        ...attrs,
      }),
      TE.map(NEA.head),
    );
}
