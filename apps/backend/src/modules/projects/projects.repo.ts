import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseError,
  TableId,
  TransactionalAttrs,
  tryGetFirstOrNotExists,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { ProjectTableRowWithRelations } from './projects.tables';

@injectable()
export class ProjectsRepo extends createDatabaseRepo('projects') {
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
            .where('projects.id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .selectAll('projects')
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
        }): ProjectTableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: {
            id: orgId,
            name: orgName,
          },
        })),
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
