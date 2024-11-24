import type { SelectType } from 'kysely';

import type { DatabaseTablesWithId } from '../database.tables';
import type { DatabaseRecordNotExists, DatabaseTE } from '../errors';
import type { NormalizeSelectTableRow } from '../types';
import type { CreateSelectRecordsQueryAttrs } from './create-select-records.query';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { createSelectRecordQuery } from './create-select-record.query';

export function createSelectRecordByIdQuery<K extends keyof DatabaseTablesWithId>(factoryAttrs: QueryBasicFactoryAttrs<K>) {
  return <S extends keyof NormalizeSelectTableRow<DatabaseTablesWithId[K]>>({
    id,
    ...attrs
  }: Omit<CreateSelectRecordsQueryAttrs<K, S>, 'limit' | 'where'> & {
    id: SelectType<DatabaseTablesWithId[K]['id']>;
  }): DatabaseTE<Pick<NormalizeSelectTableRow<DatabaseTablesWithId[K]>, S>, DatabaseRecordNotExists> =>
    createSelectRecordQuery<K>(factoryAttrs)({
      ...attrs,
      where: [['id' as any, '=', id]],
    });
}
