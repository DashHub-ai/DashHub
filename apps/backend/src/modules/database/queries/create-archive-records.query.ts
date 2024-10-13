import type {
  DatabaseTablesWithArchivedAt,
  DatabaseTablesWithId,
} from '../database.tables';
import type { RecordUpdateTableRow } from './create-record-update.query';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import {
  createRecordsUpdateQuery,
  type RecordsUpdateTableRow,
} from './create-records-update.query';

export type RecordsArchiveAttrs<K extends keyof DatabaseTablesWithId> = Omit<
  RecordsUpdateTableRow<K>,
  'value'
> & {
  relatedRowValues?: RecordUpdateTableRow<K>['value'];
  tapUpdatedAt?: boolean;
};

export type RecordsArchiveBasicAttrs<K extends keyof DatabaseTablesWithId> =
  QueryBasicFactoryAttrs<K> & {
    defaultRelatedRowValues?: RecordUpdateTableRow<K>['value'];
  };

/**
 * Creates query that sets archive_at on specified objects
 *
 * @see
 *  If transaction provided then it reuses it!
 *
 * @example
 *  const deleteUsers = createArchiveRecordsQuery('dashboard.users', db);
 *
 *  pipe(
 *    deleteUsers({ where: [['id', 'in', [123]]], forwardTransaction?: <xyz> }),
 *    TE.map(...),
 *  );
 */
export function createArchiveRecordsQuery<K extends keyof DatabaseTablesWithArchivedAt & keyof DatabaseTablesWithId>(
  {
    defaultRelatedRowValues,
    ...factoryAttrs
  }: RecordsArchiveBasicAttrs<K>,
) {
  return ({
    relatedRowValues,
    tapUpdatedAt = true,
    ...attrs
  }: RecordsArchiveAttrs<K>) =>
    createRecordsUpdateQuery(factoryAttrs)({
      ...attrs,
      value: {
        ...defaultRelatedRowValues,
        ...relatedRowValues,
        ...(tapUpdatedAt && {
          updated_at: new Date(),
        }),
        archived_at: new Date(),
      } as any,
    });
}
