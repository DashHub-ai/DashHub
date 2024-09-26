import type {
  DatabaseTablesWithArchivedAt,
  DatabaseTablesWithId,
} from '../database.tables';
import type { TransactionalAttrs } from '../transaction';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import {
  createRecordUpdateQuery,
  type RecordUpdateTableRow,
} from './create-record-update.query';

export type RecordUnarchiveAttrs<K extends keyof DatabaseTablesWithId> =
  TransactionalAttrs<Omit<RecordUpdateTableRow<K>, 'value' | 'archived_at'>> & {
    relatedRowValues?: RecordUpdateTableRow<K>['value'];
    tapUpdatedAt?: boolean;
  };

/**
 * Creates query that sets archive_at=null on specified object
 *
 * @see
 *  If transaction provided then it reuses it!
 *
 * @example
 *  const deleteUser = createUnarchiveRecordQuery('dashboard.users', db);
 *
 *  pipe(
 *    deleteUser({ id: 123, forwardTransaction?: <xyz> }),
 *    TE.map(...),
 *  );
 */
export function createUnarchiveRecordQuery<K extends keyof DatabaseTablesWithArchivedAt & keyof DatabaseTablesWithId>({
  defaultRelatedRowValues,
  ...factoryAttrs
}: QueryBasicFactoryAttrs<K> & {
  defaultRelatedRowValues?: RecordUpdateTableRow<K>['value'];
}) {
  return ({
    relatedRowValues,
    tapUpdatedAt = true,
    ...attrs
  }: RecordUnarchiveAttrs<K>) =>
    createRecordUpdateQuery(factoryAttrs)({
      ...attrs,
      value: {
        ...defaultRelatedRowValues,
        ...relatedRowValues,
        ...(tapUpdatedAt && {
          updated_at: new Date(),
        }),
        archived_at: null,
      } as any,
    });
}
