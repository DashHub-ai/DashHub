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

export type RecordsUnarchiveAttrs<K extends keyof DatabaseTablesWithId> = Omit<
  RecordsUpdateTableRow<K>,
  'value'
> & {
  relatedRowValues?: RecordUpdateTableRow<K>['value'];
  tapUpdatedAt?: boolean;
};

export type RecordsUnarchiveBasicAttrs<K extends keyof DatabaseTablesWithId> =
  QueryBasicFactoryAttrs<K> & {
    defaultRelatedRowValues?: RecordUpdateTableRow<K>['value'];
  };

export function createUnarchiveRecordsQuery<K extends keyof DatabaseTablesWithArchivedAt & keyof DatabaseTablesWithId>({
  defaultRelatedRowValues,
  ...factoryAttrs
}: RecordsUnarchiveBasicAttrs<K>) {
  return ({
    relatedRowValues,
    tapUpdatedAt = true,
    ...attrs
  }: RecordsUnarchiveAttrs<K>) =>
    createRecordsUpdateQuery(factoryAttrs)({
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
