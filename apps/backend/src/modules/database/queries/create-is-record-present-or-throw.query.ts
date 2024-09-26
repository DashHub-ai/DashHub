import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';

import type { DatabaseTablesWithId } from '../database.tables';
import type { QueryBasicFactoryAttrs } from './query-basic-factory-attrs.type';

import { DatabaseRecordNotExists, type DatabaseTE } from '../errors';
import {
  createIsRecordPresentQuery,
  type IsPresentQueryAttrs,
} from './create-is-record-present.query';

export function createIsRecordPresentOrThrowQuery<K extends keyof DatabaseTablesWithId>(factoryAttrs: QueryBasicFactoryAttrs<K>) {
  return (attrs: IsPresentQueryAttrs<K>): DatabaseTE<true, DatabaseRecordNotExists> =>
    pipe(
      createIsRecordPresentQuery(factoryAttrs)(attrs),
      TE.chainW((found) => {
        if (found) {
          return TE.right(true);
        }

        return TE.left(new DatabaseRecordNotExists({}));
      }),
    );
}
