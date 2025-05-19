import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateProjectInputT, SdkUpdateProjectInputT } from '@dashhub/sdk';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseConnectionRepo,
  DatabaseError,
  TableId,
  TableRowWithId,
  TransactionalAttrs,
  tryGetFirstOrNotExists,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import {
  mapRawJSONAggRelationToSdkPermissions,
  PermissionsRepo,
  prependCreatorIfNonPublicPermissions,
} from '../permissions';
import { ProjectsSummariesRepo } from '../projects-summaries/projects-summaries.repo';
import { ProjectTableRowWithRelations } from './projects.tables';

@injectable()
export class ProjectsRepo extends createProtectedDatabaseRepo('projects') {
  constructor(
    @inject(DatabaseConnectionRepo) connectionRepo: DatabaseConnectionRepo,
    @inject(ProjectsSummariesRepo) private readonly summariesRepo: ProjectsSummariesRepo,
  ) {
    super(connectionRepo);
  }

  createIdsIterator = this.baseRepo.createIdsIterator;

  delete = ({ id, forwardTransaction }: TransactionalAttrs<TableRowWithId>) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });

    return transaction(trx => pipe(
      this.summariesRepo.deleteAll({
        forwardTransaction: trx,
        where: [['projectId', '=', id]],
      }),
      TE.chain(() => this.baseRepo.delete({ id, forwardTransaction: trx })),
    ));
  };

  archive = createArchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  create = (
    {
      forwardTransaction,
      value: {
        organization,
        name,
        creator,
        internal,
        summary = {
          content: { generated: true },
        },
      },
    }: TransactionalAttrs<{
      value: SdkCreateProjectInputT & {
        internal?: boolean;
        creator: TableRowWithId;
      };
    }>,
  ) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });

    return transaction(trx => pipe(
      this.baseRepo.create({
        forwardTransaction: trx,
        value: {
          name,
          creatorUserId: creator.id,
          internal: !!internal,
          organizationId: organization.id,
        },
      }),
      TE.tap(({ id }) => this.summariesRepo.create({
        forwardTransaction: trx,
        value: {
          projectId: id,
          contentGenerated: summary.content?.generated ?? true,
          content: summary.content?.value,
        },
      })),
    ));
  };

  update = (
    {
      id,
      forwardTransaction,
      value: {
        name,
        internal,
        summary = {
          content: { generated: true },
        },
      },
    }: TableRowWithId & TransactionalAttrs<{
      value: SdkUpdateProjectInputT & {
        internal?: boolean;
      };
    }>,
  ) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });

    return transaction(trx => pipe(
      this.baseRepo.update({
        id,
        forwardTransaction: trx,
        value: {
          name,
          internal: !!internal,
        },
      }),
      TE.tap(({ id }) => this.summariesRepo.updateByProjectId({
        forwardTransaction: trx,
        id,
        value: summary,
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
            .where('projects.id', 'in', ids)
            .innerJoin('users', 'users.id', 'creator_user_id')
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .selectAll('projects')
            .innerJoin('projects_summaries', 'projects_summaries.project_id', 'projects.id')
            .select([
              'users.id as creator_user_id',
              'users.email as creator_user_email',
              'users.name as creator_user_name',

              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'projects_summaries.id as summary_id',
              'projects_summaries.content as summary_content',
              'projects_summaries.content_generated as summary_content_generated',
              'projects_summaries.content_generated_at as summary_content_generated_at',

              eb =>
                PermissionsRepo
                  .createPermissionAggQuery(eb)
                  .where('permissions.project_id', '=', eb.ref('projects.id'))
                  .as('permissions_json'),
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          creator_user_id: creatorUserId,
          creator_user_email: creatorUserEmail,
          creator_user_name: creatorUserName,

          organization_id: orgId,
          organization_name: orgName,

          summary_id: summaryId,
          summary_content: summaryContent,
          summary_content_generated: summaryContentGenerated,
          summary_content_generated_at: summaryContentGeneratedAt,

          permissions_json: permissions,
          ...item
        }): ProjectTableRowWithRelations => {
          const creator = {
            id: creatorUserId,
            email: creatorUserEmail,
            name: creatorUserName,
          };

          return {
            ...camelcaseKeys(item),
            creator,
            organization: {
              id: orgId,
              name: orgName,
            },
            summary: {
              id: summaryId,
              content: summaryContent,
              contentGenerated: summaryContentGenerated,
              contentGeneratedAt: summaryContentGeneratedAt,
            },
            permissions: {
              inherited: [],
              current: pipe(
                (permissions || []).map(mapRawJSONAggRelationToSdkPermissions),
                prependCreatorIfNonPublicPermissions(creator),
              ),
            },
          };
        }),
      ),
    );
  };

  getDefaultS3Bucket = ({ forwardTransaction, projectId }: TransactionalAttrs<{ projectId: TableId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom('projects')
            .where('projects.id', '=', projectId)
            .innerJoin(
              subquery =>
                subquery
                  .selectFrom('s3_resources_buckets as buckets')
                  .innerJoin(
                    'organizations_s3_resources_buckets as org_buckets',
                    'org_buckets.bucket_id',
                    'buckets.id',
                  )
                  .where('org_buckets.default', '=', true)
                  .selectAll('buckets')
                  .select('org_buckets.organization_id')
                  .as('bucket'),
              join => join
                .onRef('projects.organization_id', '=', 'bucket.organization_id'),
            )
            .selectAll('bucket')
            .limit(1)
            .execute(),
      ),
      DatabaseError.tryTask,
      tryGetFirstOrNotExists,
    );
  };
}
