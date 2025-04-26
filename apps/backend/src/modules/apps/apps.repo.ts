import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { sql } from 'kysely';
import { injectable } from 'tsyringe';

import { uniq } from '@llm/commons';
import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseError,
  type TableId,
  type TableRowWithId,
  type TableUuid,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { mapRawJSONAggRelationToSdkPermissions, PermissionsRepo } from '../permissions';
import { AppTableRowWithRelations } from './apps.tables';

@injectable()
export class AppsRepo extends createDatabaseRepo('apps') {
  archive = createArchiveRecordQuery(this.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.queryFactoryAttrs);

  findAllRecentlyUsedApps = ({ forwardTransaction, userId }: TransactionalAttrs<{ userId: TableId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom('messages')
            .innerJoin('chats', 'chats.id', 'messages.chat_id')
            .where('chats.archived', '=', false)
            .where('messages.creator_user_id', '=', userId)
            .where('messages.role', '=', 'system')
            .where('messages.app_id', 'is not', null)
            .groupBy('app_id')
            .select('app_id as id')
            .select(qb => [
              qb.fn.max('messages.created_at').as('last_used_at'),
              sql<TableUuid[]>`array_agg("chats"."id" order by "chats"."created_at" desc)`.as('chatIds'),
            ])
            .$narrowType<TableRowWithId>()
            .orderBy('last_used_at', 'desc')
            .limit(500)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(item => ({
          ...item,
          chatIds: uniq(item.chatIds ?? []),
        })),
      ),
    );
  };

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('apps.id', 'in', ids)

            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .innerJoin('apps_categories', 'apps_categories.id', 'category_id')

            .leftJoin('s3_resources', 's3_resources.id', 'apps.logo_s3_resource_id')
            .leftJoin('s3_resources_buckets', 's3_resources_buckets.id', 's3_resources.bucket_id')

            .leftJoin('ai_models', 'ai_models.id', 'apps.ai_model_id')
            .leftJoin('ai_external_apis', 'ai_external_apis.id', 'apps.ai_external_api_id')

            .innerJoin('projects', 'projects.id', 'apps.project_id')

            .selectAll('apps')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'apps_categories.id as category_id',
              'apps_categories.name as category_name',

              // AI model
              'ai_models.id as ai_model_id',
              'ai_models.name as ai_model_name',

              // AI external API
              'ai_external_apis.id as ai_external_api_id',
              'ai_external_apis.schema as ai_external_api_schema',

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

              // Project
              'projects.id as project_id',
              'projects.name as project_name',

              // Permissions
              eb =>
                PermissionsRepo
                  .createPermissionAggQuery(eb)
                  .where('permissions.app_id', '=', eb.ref('apps.id'))
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

          project_id: projectId,
          project_name: projectName,

          ai_model_id: aiModelId,
          ai_model_name: aiModelName,

          ai_external_api_id: aiExternalApiId,
          ai_external_api_schema: aiExternalApiSchema,

          ...item
        }): AppTableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: {
            id: orgId,
            name: orgName,
          },
          category: {
            id: item.category_id,
            name: item.category_name,
          },
          permissions: {
            inherited: [],
            current: (permissions || []).map(mapRawJSONAggRelationToSdkPermissions),
          },
          project: {
            id: projectId,
            name: projectName!,
          },
          aiModel: aiModelId
            ? {
                id: aiModelId,
                name: aiModelName!,
              }
            : null,
          aiExternalApi: aiExternalApiId
            ? {
                id: aiExternalApiId!,
                schema: aiExternalApiSchema!,
              }
            : null,
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
