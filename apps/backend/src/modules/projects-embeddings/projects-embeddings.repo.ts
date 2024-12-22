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
            .selectAll(this.table)
            .select([
              'projects_files.project_id as project_id',
              's3_resources.name as project_file_name',
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

          ...item
        }): ProjectEmbeddingsTableRowWithRelations => ({
          ...camelcaseKeys(item),
          project: {
            id: projectId,
          },
          projectFile: {
            id: projectFileId,
            name: projectFileName,
          },
        })),
      ),
    );
  };
}
