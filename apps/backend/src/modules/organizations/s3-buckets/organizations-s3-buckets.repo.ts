import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateS3BucketInputT, SdkUpdateS3BucketInputT } from '@llm/sdk';

import { isNil, mapAsyncIterator } from '@llm/commons';
import {
  AbstractDatabaseRepo,
  chainDatabasePromiseTE,
  DatabaseConnectionRepo,
  DatabaseError,
  IdsChunkedIteratorAttrs,
  TableId,
  tapDatabasePromiseTE,
  TransactionalAttrs,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';
import { S3ResourcesBucketsRepo } from '~/modules/s3';

import { OrganizationS3BucketTableRowWithRelations } from './organizations-s3-buckets.tables';

@injectable()
export class OrganizationsS3BucketsRepo extends AbstractDatabaseRepo {
  constructor(
    @inject(DatabaseConnectionRepo) connectionRepo: DatabaseConnectionRepo,
    @inject(S3ResourcesBucketsRepo) private readonly s3ResourcesBucketsRepo: S3ResourcesBucketsRepo,
  ) {
    super(connectionRepo);
  }

  unarchive = this.s3ResourcesBucketsRepo.unarchive;

  archive = this.s3ResourcesBucketsRepo.archive;

  archiveRecords = this.s3ResourcesBucketsRepo.archiveRecords;

  createIdsIterator = (
    { organizationId, ...attrs }: IdsChunkedIteratorAttrs<'s3_resources_buckets'> & {
      organizationId?: TableId;
    },
  ): AsyncIterableIterator<TableId[]> => {
    const { queryBuilder } = this.s3ResourcesBucketsRepo;
    const query = queryBuilder
      .createSelectIdQuery()
      .innerJoin(
        'organizations_s3_resources_buckets',
        's3_resources_buckets.id',
        'bucket_id',
      )
      .$if(!isNil(organizationId), qb => qb.where('organization_id', '=', organizationId!));

    return pipe(
      query,
      queryBuilder.createChunkedIterator(attrs),
      mapAsyncIterator(A.map(item => item.id)),
    );
  };

  getDefaultS3Bucket = (
    {
      forwardTransaction,
      organizationId,
    }: TransactionalAttrs<{ organizationId: TableId; }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom('organizations_s3_resources_buckets as org_buckets')
            .where('org_buckets.organization_id', '=', organizationId)
            .where('org_buckets.default', '=', true)
            .select(['bucket_id as id'])
            .executeTakeFirstOrThrow(),
      ),
      DatabaseError.tryTask,
    );
  };

  create = ({ forwardTransaction, value }: TransactionalAttrs<{ value: SdkCreateS3BucketInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });

    return transaction(trx => pipe(
      this.s3ResourcesBucketsRepo.create({
        forwardTransaction: trx,
        value: {
          accessKeyId: value.accessKeyId,
          name: value.name,
          region: value.region,
          secretAccessKey: value.secretAccessKey,
          endpoint: value.endpoint,
          port: value.port,
          ssl: value.ssl,
          bucketName: value.bucketName,
          publicBaseUrl: value.publicBaseUrl,
        },
      }),
      TE.tap(() => {
        if (!value.default) {
          return TE.right(undefined);
        }

        return this.markAllBucketsAsNotDefault({
          forwardTransaction: trx,
          organizationId: value.organization.id,
        });
      }),
      chainDatabasePromiseTE(
        async bucket => trx
          .insertInto('organizations_s3_resources_buckets')
          .values({
            bucket_id: bucket.id,
            organization_id: value.organization.id,
            default: value.default,
          })
          .returning('bucket_id as id')
          .executeTakeFirstOrThrow(),
      ),
    ));
  };

  update = ({ forwardTransaction, id, value }: TransactionalAttrs<{ id: TableId; value: SdkUpdateS3BucketInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });

    return transaction(trx => pipe(
      TE.Do,
      TE.bind('organization', () => DatabaseError.tryTask(async () =>
        trx
          .selectFrom('organizations_s3_resources_buckets')
          .where('bucket_id', '=', id)
          .select(['organization_id as id'])
          .executeTakeFirstOrThrow(),
      )),
      TE.bind('_', () => this.s3ResourcesBucketsRepo.update({
        forwardTransaction: trx,
        id,
        value: {
          accessKeyId: value.accessKeyId,
          name: value.name,
          region: value.region,
          secretAccessKey: value.secretAccessKey,
          bucketName: value.bucketName,
          ssl: value.ssl,
          endpoint: value.endpoint,
          port: value.port,
          publicBaseUrl: value.publicBaseUrl,
        },
      })),
      TE.tap(({ organization }) => {
        if (!value.default) {
          return TE.right(undefined);
        }

        return this.markAllBucketsAsNotDefault({
          forwardTransaction: trx,
          organizationId: organization.id,
        });
      }),
      tapDatabasePromiseTE(
        async () => trx
          .updateTable('organizations_s3_resources_buckets')
          .set({ default: value.default })
          .where('bucket_id', '=', id)
          .execute(),
      ),
      TE.map(({ organization }) => ({
        id,
        organization,
      })),
    ));
  };

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom('organizations_s3_resources_buckets as org_buckets')
            .where('org_buckets.bucket_id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .innerJoin('s3_resources_buckets as buckets', 'buckets.id', 'bucket_id')
            .selectAll('buckets')
            .select([
              'org_buckets.default as is_default',
              'organizations.id as organization_id',
              'organizations.name as organization_name',
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          is_default: isDefault,

          organization_id: orgId,
          organization_name: orgName,

          ...bucket
        }): OrganizationS3BucketTableRowWithRelations => ({
          default: isDefault,
          bucket: camelcaseKeys(bucket),
          organization: {
            id: orgId,
            name: orgName,
          },
        })),
      ),
    );
  };

  private readonly markAllBucketsAsNotDefault = (
    {
      forwardTransaction,
      organizationId,
    }: TransactionalAttrs<{ organizationId: TableId; }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(trx =>
        trx
          .updateTable('organizations_s3_resources_buckets')
          .set({ default: false })
          .where('organization_id', '=', organizationId)
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };
}
