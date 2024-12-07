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

import { AppTableRowWithRelations } from './apps-categories.tables';

@injectable()
export class AppsCategoriesRepo extends createDatabaseRepo('apps_categories') {
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
            .selectFrom(`${this.table} as category`)
            .where('category.id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .leftJoin('apps_categories as parent_categories', 'parent_categories.id', 'category.parent_category_id')
            .selectAll('category')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'parent_categories.id as parent_category_id',
              'parent_categories.name as parent_category_name',
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          organization_id: orgId,
          organization_name: orgName,

          parent_category_id: parentId,
          parent_category_name: parentName,
          ...item
        }): AppTableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: {
            id: orgId,
            name: orgName,
          },
          parentCategory: parentId
            ? {
                id: parentId,
                name: parentName || '',
              }
            : null,
        })),
      ),
    );
  };
}
