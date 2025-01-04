import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { jsonBuildObject } from 'kysely/helpers/postgres';
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

import { AppTableRowWithRelations } from './apps.tables';

@injectable()
export class AppsRepo extends createDatabaseRepo('apps') {
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
            .where('apps.id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .innerJoin('apps_categories', 'apps_categories.id', 'category_id')
            .selectAll('apps')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'apps_categories.id as category_id',
              'apps_categories.name as category_name',

              eb => eb
                .selectFrom('permissions')
                .where('permissions.app_id', '=', eb.ref('apps.id'))
                .select(neb => [
                  neb.fn.jsonAgg(
                    jsonBuildObject({
                      id: neb.ref('permissions.id').$notNull(),
                      access_level: neb.ref('permissions.access_level').$notNull(),
                      group_id: neb.ref('permissions.group_id'),
                      user_id: neb.ref('permissions.user_id'),
                    }),
                  )
                    .$notNull()
                    .as('permissions_json'),
                ])
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
          permissions: (permissions || []).map(obj => camelcaseKeys(obj)),
        })),
      ),
    );
  };
}
