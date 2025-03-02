import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseConnectionRepo,
  DatabaseError,
  type TableId,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { OrganizationTableRowWithRelations } from './organizations.tables';

@injectable()
export class OrganizationsRepo extends createDatabaseRepo('organizations') {
  constructor(
    @inject(DatabaseConnectionRepo) databaseConnectionRepo: DatabaseConnectionRepo,
  ) {
    super(databaseConnectionRepo);
  }

  archive = createArchiveRecordQuery(this.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.queryFactoryAttrs);

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('organizations.id', 'in', ids)
            .leftJoin('organizations_ai_settings', 'organizations_ai_settings.organization_id', 'organizations.id')
            .innerJoin('projects', 'projects.id', 'organizations_ai_settings.project_id')
            .selectAll('organizations')
            .select([
              'organizations_ai_settings.chat_context as ai_settings_chat_context',
              'projects.id as ai_settings_project_id',
              'projects.name as ai_settings_project_name',
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          ai_settings_chat_context: aiSettingsChatContext,
          ai_settings_project_id: projectId,
          ai_settings_project_name: projectName,
          ...organization
        }): OrganizationTableRowWithRelations => ({
          ...camelcaseKeys(organization),
          aiSettings: {
            chatContext: aiSettingsChatContext,
            project: {
              id: projectId,
              name: projectName,
            },
          },
        })),
      ),
    );
  };
}
