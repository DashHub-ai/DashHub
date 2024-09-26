import { pipe } from 'fp-ts/function';

import type { DatabaseTables } from '../database.tables';
import type { DatabaseRecordNotExists, DatabaseTE } from '../errors';
import type { NormalizeSelectTableRow } from '../types';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { tryGetFirstOrNotExists } from '../helpers';
import {
  createSelectRecordsQuery,
  type CreateSelectRecordsQueryAttrs,
} from './create-select-records.query';

export function createSelectRecordQuery<K extends keyof DatabaseTables>(factoryAttrs: QueryBasicFactoryAttrs<K>) {
  return <S extends keyof NormalizeSelectTableRow<DatabaseTables[K]>>(
    attrs: Omit<CreateSelectRecordsQueryAttrs<K, S>, 'limit'>,
  ): DatabaseTE<Pick<NormalizeSelectTableRow<DatabaseTables[K]>, S>, DatabaseRecordNotExists> =>
    pipe(
      createSelectRecordsQuery<K>(factoryAttrs)({
        ...attrs,
        limit: 1,
      }),
      tryGetFirstOrNotExists,
    );
}
