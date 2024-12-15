import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import { createChunkAsyncIterator, isNil, mapAsyncIterator } from '@llm/commons';

import {
  AbstractDatabaseRepo,
  DatabaseError,
  TableId,
  TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '../database';
import { ProjectFileTableInsertRow, ProjectFileTableRowWithRelations } from './projects-files.tables';

@injectable()
export class ProjectsFilesRepo extends AbstractDatabaseRepo {
  create = (
    {
      forwardTransaction,
      projectId,
      s3ResourceId,
    }: TransactionalAttrs<ProjectFileTableInsertRow>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .insertInto('projects_files')
            .values({
              project_id: projectId,
              s3_resource_id: s3ResourceId,
            })
            .execute(),
      ),
      DatabaseError.tryTask,
    );
  };

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom('projects_files')
            .where('s3_resource_id', 'in', ids)
            .innerJoin('s3_resources', 's3_resources.id', 's3_resource_id')
            .innerJoin('s3_resources_buckets', 's3_resources_buckets.id', 's3_resources.bucket_id')
            .innerJoin('projects', 'projects.id', 'project_id')
            .selectAll('s3_resources')
            .select([
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

          ...item
        }): ProjectFileTableRowWithRelations => ({
          ...camelcaseKeys(item),

          publicUrl: `${bucketBaseUrl}/${item.s3_key}`,

          project: {
            id: projectId,
            name: projectName,
          },

          bucket: {
            id: bucketId,
            name: bucketName,
          },
        })),
      ),
    );
  };

  createIdsIterator = (
    { chunkSize, projectId }: {
      chunkSize: number;
      projectId?: TableId;
    },
  ): AsyncIterableIterator<TableId[]> => pipe(
    this.db
      .selectFrom('projects_files')
      .select('s3_resource_id')
      .orderBy('s3_resource_id', 'asc')
      .$if(!isNil(projectId), qb => qb.where('project_id', '=', projectId!))
      .stream(chunkSize),
    createChunkAsyncIterator(chunkSize),
    mapAsyncIterator(A.map(item => item.s3_resource_id)),
  );
}
