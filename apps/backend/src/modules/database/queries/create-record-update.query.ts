import { pipe } from 'fp-ts/function';

import type { DatabaseTablesWithId } from '../database.tables';
import type { TableId } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { tryGetFirstOrNotExists } from '../helpers';
import {
  createRecordsUpdateQuery,
  type RecordsUpdateTableRow,
} from './create-records-update.query';

export type RecordUpdateTableRow<K extends keyof DatabaseTablesWithId> = Omit<
  RecordsUpdateTableRow<K>,
  'where'
> & {
  id: TableId;
};

export function createRecordUpdateQuery<K extends keyof DatabaseTablesWithId>(basicAttrs: QueryBasicFactoryAttrs<K>) {
  return ({ id, ...attrs }: RecordUpdateTableRow<K>) =>
    pipe(
      createRecordsUpdateQuery(basicAttrs)({
        ...attrs,
        where: [['id' as any, '=', id]],
      }),
      tryGetFirstOrNotExists,
    );
}
