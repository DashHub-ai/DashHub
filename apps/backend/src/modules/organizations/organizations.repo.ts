import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateOrganizationInputT } from '@llm/sdk';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseConnectionRepo,
  DatabaseError,
  TableId,
  type TransactionalAttrs,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { OrganizationsAISettingsRepo } from '../organizations-ai-settings';
import { OrganizationTableRowWithRelations } from './organizations.tables';

@injectable()
export class OrganizationsRepo extends createProtectedDatabaseRepo('organizations') {
  constructor(
    @inject(DatabaseConnectionRepo) databaseConnectionRepo: DatabaseConnectionRepo,
    @inject(OrganizationsAISettingsRepo) private readonly organizationsAISettingsRepo: OrganizationsAISettingsRepo,
  ) {
    super(databaseConnectionRepo);
  }

  createIdsIterator = this.baseRepo.createIdsIterator;

  archive = createArchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  create = ({ value, forwardTransaction }: TransactionalAttrs<{ value: SdkCreateOrganizationInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.baseRepo.create({
        forwardTransaction: trx,
        value: {
          name: value.name,
          maxNumberOfUsers: value.maxNumberOfUsers,
        },
      }),
      TE.tap(({ id }) => this.organizationsAISettingsRepo.upsert({
        forwardTransaction: trx,
        value: {
          organizationId: id,
          chatContext: value.aiSettings.chatContext,
        },
      })),
    ));
  };

  update = ({ id, value, forwardTransaction }: TransactionalAttrs<{
    id: TableId;
    value: SdkCreateOrganizationInputT;
  }>) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.baseRepo.update({
        id,
        forwardTransaction: trx,
        value: {
          name: value.name,
          maxNumberOfUsers: value.maxNumberOfUsers,
        },
      }),
      TE.tap(() => this.organizationsAISettingsRepo.upsert({
        forwardTransaction: trx,
        value: {
          organizationId: id,
          chatContext: value.aiSettings.chatContext,
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
            .where('organizations.id', 'in', ids)
            .leftJoin('organizations_ai_settings', 'organizations_ai_settings.organization_id', 'organizations.id')
            .selectAll('organizations')
            .select([
              'organizations_ai_settings.chat_context as ai_settings_chat_context',
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          ai_settings_chat_context: aiSettingsChatContext,
          ...organization
        }): OrganizationTableRowWithRelations => ({
          ...camelcaseKeys(organization),
          aiSettings: {
            chatContext: aiSettingsChatContext,
          },
        })),
      ),
    );
  };
}
