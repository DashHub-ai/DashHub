import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { sql } from 'kysely';
import { injectable } from 'tsyringe';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseError,
  type TableId,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { mapRawJSONAggRelationToSdkPermissions, PermissionsRepo } from '../permissions';
import { AIExternalAPITableRowWithRelations } from './ai-external-apis.tables';

@injectable()
export class AIExternalAPIsRepo extends createDatabaseRepo('ai_external_apis') {
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
            .where('ai_external_apis.id', 'in', ids)

            .innerJoin('organizations', 'organizations.id', 'organization_id')

            .leftJoin('s3_resources', 's3_resources.id', 'ai_external_apis.logo_s3_resource_id')
            .leftJoin('s3_resources_buckets', 's3_resources_buckets.id', 's3_resources.bucket_id')

            .selectAll('ai_external_apis')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              // Logo
              's3_resources.id as logo_s3_resource_id',
              's3_resources.name as logo_s3_resource_name',
              's3_resources.created_at as logo_s3_resource_created_at',
              's3_resources.updated_at as logo_s3_resource_updated_at',
              's3_resources.type as logo_s3_resource_type',
              's3_resources.s3_key as logo_s3_resource_s3_key',
              eb => sql<string>`${eb.ref('s3_resources_buckets.public_base_url')} || '/' || ${eb.ref('s3_resources.s3_key')}`.as('logo_s3_resource_public_url'),

              // Logo bucket
              's3_resources_buckets.id as logo_s3_resource_bucket_id',
              's3_resources_buckets.name as logo_s3_resource_bucket_name',

              // Permissions
              eb =>
                PermissionsRepo
                  .createPermissionAggQuery(eb)
                  .where('permissions.ai_external_api_id', '=', eb.ref('ai_external_apis.id'))
                  .as('permissions_json'),
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          organization_id: orgId,
          organization_name: orgName,

          permissions_json: permissions,

          logo_s3_resource_id: logoId,
          logo_s3_resource_name: logoName,
          logo_s3_resource_created_at: logoCreatedAt,
          logo_s3_resource_updated_at: logoUpdatedAt,
          logo_s3_resource_type: logoType,
          logo_s3_resource_s3_key: logoS3Key,
          logo_s3_resource_public_url: logoPublicUrl,

          logo_s3_resource_bucket_id: logoBucketId,
          logo_s3_resource_bucket_name: logoBucketName,

          ...item
        }): AIExternalAPITableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: {
            id: orgId,
            name: orgName,
          },
          permissions: {
            inherited: [],
            current: (permissions || []).map(mapRawJSONAggRelationToSdkPermissions),
          },
          logo: logoId
            ? {
                id: logoId,
                name: logoName!,
                createdAt: logoCreatedAt!,
                updatedAt: logoUpdatedAt!,
                type: logoType!,
                s3Key: logoS3Key!,
                publicUrl: logoPublicUrl!,
                bucket: {
                  id: logoBucketId!,
                  name: logoBucketName!,
                },
              }
            : null,
        })),
      ),
    );
  };
}
