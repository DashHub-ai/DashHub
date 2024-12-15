import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { identity, pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { createChunkAsyncIterator, isNil, mapAsyncIterator } from '@llm/commons';

import type { ProjectFileTableInsertRow, ProjectFileTableRowWithRelations } from './projects-files.tables';

import {
  AbstractDatabaseRepo,
  DatabaseConnectionRepo,
  DatabaseError,
  DatabaseRecordNotExists,
  TableId,
  TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '../database';
import { S3ResourcesRepo } from '../s3/repo/s3-resources.repo';

type ProjectResourceLookupAttrs = TransactionalAttrs<{
  projectId: TableId;
  resourceId: TableId;
}>;

@injectable()
export class ProjectsFilesRepo extends AbstractDatabaseRepo {
  constructor(
    @inject(DatabaseConnectionRepo) connectionRepo: DatabaseConnectionRepo,
    @inject(S3ResourcesRepo) private readonly s3ResourcesRepo: S3ResourcesRepo,
  ) {
    super(connectionRepo);
  }

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

  exists = (
    {
      forwardTransaction,
      projectId,
      resourceId,
    }: ProjectResourceLookupAttrs,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom('projects_files')
            .where('project_id', '=', projectId)
            .where('s3_resource_id', '=', resourceId)
            .select(qb.fn.count('s3_resource_id').as('total'))
            .executeTakeFirstOrThrow(),
      ),
      DatabaseError.tryTask,
      TE.map(result => Number(result.total) > 0),
    );
  };

  existsOrThrow = (attrs: ProjectResourceLookupAttrs) => pipe(
    this.exists(attrs),
    TE.chainW(
      TE.fromPredicate(
        identity,
        () => new DatabaseRecordNotExists(attrs),
      ),
    ),
  );

  delete = (
    {
      forwardTransaction,
      resourceId,
      projectId,
    }: ProjectResourceLookupAttrs,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb => qb
          .deleteFrom('projects_files')
          .where('s3_resource_id', '=', resourceId)
          .where('project_id', '=', projectId)
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
