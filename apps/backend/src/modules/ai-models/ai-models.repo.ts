import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import { isSDKCredentialsMasked, SdkCreateAIModelInputT, SdkUpdateAIModelInputT } from '@dashhub/sdk';
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

import { AIModelTableRowWithRelations } from './ai-models.tables';

@injectable()
export class AIModelsRepo extends createProtectedDatabaseRepo('ai_models') {
  createIdsIterator = this.baseRepo.createIdsIterator;

  archive = createArchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  create = ({ forwardTransaction, value: { organization, ...value } }: TransactionalAttrs<{ value: SdkCreateAIModelInputT; }>) => {
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

  update = ({ forwardTransaction, id, value }: TransactionalAttrs<{ id: TableId; value: SdkUpdateAIModelInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });
    const {
      credentials: { apiKey, ...credentials },
      ...record
    } = value;

    return transaction(trx => pipe(
      TE.Do,
      TE.bind('aiModel', () => this.baseRepo.findById({ forwardTransaction: trx, id })),
      TE.tap(({ aiModel }) => {
        if (!value.default) {
          return TE.of(undefined);
        }

        return this.markAllModelsAsNotDefault({
          forwardTransaction: trx,
          organizationId: aiModel.organizationId,
        });
      }),
      TE.tap(({ aiModel }) => this.baseRepo.update({
        id,
        forwardTransaction: trx,
        value: {
          ...record,
          credentials: {
            ...credentials,
            apiKey: isSDKCredentialsMasked(apiKey) ? aiModel.credentials.apiKey : apiKey,
          },
        },
      })),
      TE.map(({ aiModel }) => ({
        id,
        organization: {
          id: aiModel.organizationId,
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
            .where('ai_models.id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .selectAll('ai_models')
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
        }): AIModelTableRowWithRelations => ({
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
          .updateTable('ai_models')
          .set({ default: false })
          .where('organization_id', '=', organizationId)
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };
}
