import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { injectable } from 'tsyringe';

import {
  createDatabaseRepo,
  DatabaseError,
  type TableId,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '../database';
import { ProjectEmbeddingsTableRowWithRelations } from './projects-embeddings.tables';

@injectable()
export class ProjectsEmbeddingsRepo extends createDatabaseRepo('projects_embeddings') {
  deleteByProjectFileId = ({ forwardTransaction, projectFileId }: TransactionalAttrs<{ projectFileId: TableId; }>) =>
    this.deleteAll({
      forwardTransaction,
      where: [['projectFileId', '=', projectFileId]],
    });

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('projects_embeddings.id', 'in', ids)
            .innerJoin('projects_files', 'projects_files.id', 'project_file_id')
            .innerJoin('s3_resources', 's3_resources.id', 'projects_files.s3_resource_id')
            .innerJoin('s3_resources_buckets', 's3_resources_buckets.id', 's3_resources.bucket_id')
            .selectAll(this.table)
            .select([
              'projects_files.project_id as project_id',
              's3_resources.name as project_file_name',

              's3_resources.id as project_file_s3_resource_id',
              's3_resources.s3_key as project_file_s3_resource_s3_key',
              's3_resources_buckets.public_base_url as bucket_public_base_url',
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          project_id: projectId,

          project_file_id: projectFileId,
          project_file_name: projectFileName,

          project_file_s3_resource_id: projectFileS3ResourceId,
          project_file_s3_resource_s3_key: projectFileS3ResourceS3Key,
          bucket_public_base_url: bucketBaseUrl,

          ...item
        }): ProjectEmbeddingsTableRowWithRelations => ({
          ...camelcaseKeys(item),
          project: {
            id: projectId,
          },
          projectFile: {
            id: projectFileId,
            name: projectFileName,
            resource: {
              id: projectFileS3ResourceId,
              publicUrl: `${bucketBaseUrl}/${projectFileS3ResourceS3Key}`,
            },
          },
        })),
      ),
    );
  };
}
