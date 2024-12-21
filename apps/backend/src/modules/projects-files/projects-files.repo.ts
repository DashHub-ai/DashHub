import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { ProjectFileTableRowWithRelations } from './projects-files.tables';

import {
  createDatabaseRepo,
  DatabaseConnectionRepo,
  DatabaseError,
  TableId,
  TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '../database';

@injectable()
export class ProjectsFilesRepo extends createDatabaseRepo('projects_files') {
  constructor(
    @inject(DatabaseConnectionRepo) connectionRepo: DatabaseConnectionRepo,
  ) {
    super(connectionRepo);
  }

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom('projects_files')
            .where('projects_files.id', 'in', ids)
            .innerJoin('s3_resources', 's3_resources.id', 's3_resource_id')
            .innerJoin('s3_resources_buckets', 's3_resources_buckets.id', 's3_resources.bucket_id')
            .innerJoin('projects', 'projects.id', 'project_id')
            .selectAll('projects_files')
            .select([
              's3_resources.name as s3_resource_name',
              's3_resources.s3_key as s3_key',
              's3_resources.type as s3_resource_type',
              's3_resources.created_at as s3_resource_created_at',
              's3_resources.updated_at as s3_resource_updated_at',

              'projects.id as project_id',
              'projects.name as project_name',

              's3_resources_buckets.id as bucket_id',
              's3_resources_buckets.name as bucket_name',
              's3_resources_buckets.public_base_url as bucket_public_base_url',
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          project_id: projectId,
          project_name: projectName,

          bucket_id: bucketId,
          bucket_name: bucketName,
          bucket_public_base_url: bucketBaseUrl,

          s3_resource_id: s3ResourceId,
          s3_key: s3ResourceKey,
          s3_resource_name: s3ResourceName,
          s3_resource_type: s3ResourceType,
          s3_resource_created_at: s3ResourceCreatedAt,
          s3_resource_updated_at: s3ResourceUpdatedAt,

          ...item
        }): ProjectFileTableRowWithRelations => ({
          ...camelcaseKeys(item),

          resource: {
            id: s3ResourceId,
            createdAt: s3ResourceCreatedAt,
            updatedAt: s3ResourceUpdatedAt,
            s3Key: s3ResourceKey,
            name: s3ResourceName,
            type: s3ResourceType,
            publicUrl: `${bucketBaseUrl}/${s3ResourceKey}`,
            bucket: {
              id: bucketId,
              name: bucketName,
            },
          },

          project: {
            id: projectId,
            name: projectName,
          },
        })),
      ),
    );
  };
}
