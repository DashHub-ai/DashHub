import { pipe } from 'fp-ts/lib/function';

import type {
  DatabaseTablesWithArchivedAt,
  DatabaseTablesWithId,
} from '../database.tables';
import type { TableId } from '../types';

import { tryGetFirstOrNotExists } from '../helpers';
import {
  createArchiveRecordsQuery,
  type RecordsArchiveAttrs,
  type RecordsArchiveBasicAttrs,
} from './create-archive-records.query';

export type RecordArchiveAttrs<K extends keyof DatabaseTablesWithId> = Omit<
  RecordsArchiveAttrs<K>,
  'where'
> & {
  id: TableId;
};

/**
 * Creates query that sets archive_at on specified object
 *
 * @see
 *  If transaction provided then it reuses it!
 *
 * @example
 *  const deleteUser = createArchiveRecordQuery('dashboard.users', db);
 *
 *  pipe(
 *    deleteUser({ id: 123, forwardTransaction?: <xyz> }),
 *    TE.map(...),
 *  );
 */
export function createArchiveRecordQuery<K extends keyof DatabaseTablesWithArchivedAt & keyof DatabaseTablesWithId>(basicAttrs: RecordsArchiveBasicAttrs<K>) {
  return ({ id, ...attrs }: RecordArchiveAttrs<K>) =>
    pipe(
      createArchiveRecordsQuery(basicAttrs)({
        ...attrs,
        where: [['id' as any, '=', id]],
      }),
      tryGetFirstOrNotExists,
    );
}
