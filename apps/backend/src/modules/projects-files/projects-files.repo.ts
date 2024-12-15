import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import { AbstractDatabaseRepo, DatabaseError, TransactionalAttrs, tryReuseTransactionOrSkip } from '../database';
import { ProjectsFilesTableInsertRow } from './projects-files.tables';

@injectable()
export class ProjectsFilesRepo extends AbstractDatabaseRepo {
  create = (
    {
      forwardTransaction,
      projectId,
      s3ResourceId,
    }: TransactionalAttrs<ProjectsFilesTableInsertRow>,
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
}
