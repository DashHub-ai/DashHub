import type { SelectQueryBuilder } from 'kysely';

import * as A from 'fp-ts/lib/Array';
import { pipe } from 'fp-ts/lib/function';
import { inject } from 'tsyringe';

import {
  createChunkAsyncIterator,
  mapAsyncIterator,
} from '@llm/commons';

import type { DatabaseTables, DatabaseTablesWithId } from './database.tables';
import type { TableId } from './types';

import { DatabaseConnectionRepo } from './connection';
import {
  createDeleteRecordQuery,
  createDeleteRecordsQuery,
  createIsRecordPresentOrThrowQuery,
  createIsRecordPresentQuery,
  createRecordInsertQuery,
  createRecordsInsertQuery,
  createRecordsUpdateQuery,
  createRecordUpdateQuery,
  createSelectByIdsQuery,
  createSelectRecordByIdQuery,
  createSelectRecordQuery,
  createSelectRecordsQuery,
  createWhereSelectQuery,
  type WhereQueryBuilderAttrs,
} from './queries';

export type IdsChunkedIteratorAttrs<DT extends keyof DatabaseTables> =
  WhereQueryBuilderAttrs<DT> & {
    chunkSize: number;
  };

export abstract class AbstractDatabaseRepo {
  constructor(
    @inject(DatabaseConnectionRepo) readonly connectionRepo: DatabaseConnectionRepo,
  ) {}

  get db() {
    return this.connectionRepo.connection;
  }
}

export function createDatabaseRepo<K extends keyof DatabaseTablesWithId>(table: K) {
  return class DatabaseRepo extends AbstractDatabaseRepo {
    get table() {
      return table;
    }

    get queryFactoryAttrs() {
      return {
        table,
        db: this.db,
      } as const;
    }

    readonly isPresent = createIsRecordPresentQuery<K>(this.queryFactoryAttrs);

    readonly isPresentOrThrow = createIsRecordPresentOrThrowQuery<K>(
      this.queryFactoryAttrs,
    );

    readonly findOne = createSelectRecordQuery<K>(this.queryFactoryAttrs);

    readonly findById = createSelectRecordByIdQuery<K>(this.queryFactoryAttrs);

    readonly findByIds = createSelectByIdsQuery<K>(this.queryFactoryAttrs);

    readonly find = createSelectRecordsQuery<K>(this.queryFactoryAttrs);

    readonly create = createRecordInsertQuery<K>(this.queryFactoryAttrs);

    readonly createBulk = createRecordsInsertQuery<K>(this.queryFactoryAttrs);

    readonly delete = createDeleteRecordQuery<K>(this.queryFactoryAttrs);

    readonly deleteAll = createDeleteRecordsQuery<K>(this.queryFactoryAttrs);

    readonly update = createRecordUpdateQuery<K>(this.queryFactoryAttrs);

    readonly updateAll = createRecordsUpdateQuery<K>(this.queryFactoryAttrs);

    createIdsIterator = (
      attrs: IdsChunkedIteratorAttrs<K>,
    ): AsyncIterableIterator<TableId[]> => {
      const { createSelectIdQuery, createChunkedIterator } = this.queryBuilder;

      return pipe(
        createSelectIdQuery(),
        createChunkedIterator(attrs),
        mapAsyncIterator(A.map(item => item.id)),
      );
    };

    readonly queryBuilder = {
      createChunkedIterator:
        ({ chunkSize, where }: IdsChunkedIteratorAttrs<K>) =>
          <DB, TB extends keyof DB, O>(query: SelectQueryBuilder<DB, TB, O>) =>
            pipe(
              query,
              createWhereSelectQuery({ where }),
              qb => qb.stream(chunkSize),
              createChunkAsyncIterator(chunkSize),
            ),

      createSelectIdQuery: () =>
        this.db.selectFrom(table).select(['id']).orderBy('id', 'asc'),
    };
  };
}

export function createProtectedDatabaseRepo<
  K extends keyof DatabaseTablesWithId,
>(table: K) {
  class BaseRepo extends createDatabaseRepo(table) {}

  return class NonExportedRepo extends AbstractDatabaseRepo {
    protected readonly baseRepo = new BaseRepo(this.connectionRepo);

    get table() {
      return table;
    }
  };
}
