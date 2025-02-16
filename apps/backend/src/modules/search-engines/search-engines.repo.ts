import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  isSDKCredentialsMasked,
  SdkCreateSearchEngineInputT,
  SdkUpdateSearchEngineInputT,
} from '@llm/sdk';
import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseError,
  TableId,
  TransactionalAttrs,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { SearchEngineTableRowWithRelations } from './search-engines.tables';

@injectable()
export class SearchEnginesRepo extends createProtectedDatabaseRepo('search_engines') {
  createIdsIterator = this.baseRepo.createIdsIterator;

  archive = createArchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  create = ({ forwardTransaction, value: { organization, ...value } }: TransactionalAttrs<{ value: SdkCreateSearchEngineInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });

    return transaction(trx => pipe(
      value.default
        ? this.markAllModelsAsNotDefault({
            forwardTransaction: trx,
            organizationId: organization.id,
          })
        : TE.right([]),
      TE.chain(() => this.baseRepo.create({
        forwardTransaction: trx,
        value: {
          ...value,
          organizationId: organization.id,
        },
      })),
    ));
  };

  update = ({ forwardTransaction, id, value }: TransactionalAttrs<{ id: TableId; value: SdkUpdateSearchEngineInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });
    const {
      credentials: { apiKey, ...credentials },
      ...record
    } = value;

    return transaction(trx => pipe(
      TE.Do,
      TE.bind('searchEngine', () => this.baseRepo.findById({ forwardTransaction: trx, id })),
      TE.tap(({ searchEngine }) => {
        if (!value.default) {
          return TE.of(undefined);
        }

        return this.markAllModelsAsNotDefault({
          forwardTransaction: trx,
          organizationId: searchEngine.organizationId,
        });
      }),
      TE.tap(({ searchEngine }) => this.baseRepo.update({
        id,
        forwardTransaction: trx,
        value: {
          ...record,
          credentials: {
            ...credentials,
            apiKey: isSDKCredentialsMasked(apiKey) ? searchEngine.credentials.apiKey : apiKey,
          },
        },
      })),
      TE.map(({ searchEngine }) => ({
        id,
        organization: {
          id: searchEngine.organizationId,
        },
      })),
    ));
  };

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('search_engines.id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .selectAll('search_engines')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          organization_id: orgId,
          organization_name: orgName,
          ...item
        }): SearchEngineTableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: {
            id: orgId,
            name: orgName,
          },
        })),
      ),
    );
  };

  private readonly markAllModelsAsNotDefault = (
    {
      forwardTransaction,
      organizationId,
    }: TransactionalAttrs<{ organizationId: TableId; }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(trx =>
        trx
          .updateTable('search_engines')
          .set({ default: false })
          .where('organization_id', '=', organizationId)
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };
}
