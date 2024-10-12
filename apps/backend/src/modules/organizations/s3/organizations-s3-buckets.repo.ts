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
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { OrganizationS3BucketTableRowWithRelations } from './organizations-s3-buckets.tables';

@injectable()
export class OrganizationsS3BucketsRepo extends createDatabaseRepo('organizations_s3_resources_buckets') {
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
            .selectFrom(`${this.table} as org_buckets`)
            .where('org_buckets.id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .innerJoin('s3_resources_buckets', 's3_resources_buckets.id', 'bucket_id')
            .selectAll('org_buckets')
            .select([
              's3_resources_buckets.id as bucket_id',
              's3_resources_buckets.name as bucket_name',
              's3_resources_buckets.region as bucket_region',
              's3_resources_buckets.accessKeyId as bucket_access_key_id',
              's3_resources_buckets.secretAccessKey as bucket_secret_access_key',

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

          bucket_id: bucketId,
          bucket_name: bucketName,
          bucket_region: bucketRegion,
          bucket_access_key_id: bucketAccessKeyId,
          bucket_secret_access_key: bucketSecretAccessKey,

          ...item
        }): OrganizationS3BucketTableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: {
            id: orgId,
            name: orgName,
          },
          bucket: {
            id: bucketId,
            name: bucketName,
            region: bucketRegion,
            accessKeyId: bucketAccessKeyId,
            secretAccessKey: bucketSecretAccessKey,
          },
        })),
      ),
    );
  };
}
