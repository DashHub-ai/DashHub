import type { SelectType } from 'kysely';

import { pipe } from 'fp-ts/lib/function';

import type { DatabaseTablesWithId } from '../database.tables';
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
  id: SelectType<DatabaseTablesWithId[K]['id']>;
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
