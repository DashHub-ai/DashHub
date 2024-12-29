import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { injectable } from 'tsyringe';

import type { UsersGroupTableRowWithRelations } from '../users-groups.tables';

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
} from '../../database';

@injectable()
export class UsersGroupsRepo extends createDatabaseRepo('users_groups') {
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
            .selectFrom(`${this.table} as group`)
            .where('group.id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .innerJoin('users as creator', 'creator.id', 'creator_user_id')
            .selectAll('group')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'creator.id as creator_id',
              'creator.email as creator_email',

              eb => eb
                .selectFrom('users_groups_users')
                .where('users_groups_users.group_id', '=', eb.ref('group.id'))
                .innerJoin('users', 'users.id', 'users_groups_users.user_id')
                .select(eb => [
                  eb.fn
                    .jsonAgg(
                      jsonBuildObject({
                        id: eb.ref('users.id').$notNull(),
                        email: eb.ref('users.email').$notNull(),
                      }),
                    )
                    .as('users'),
                ])
                .as('users'),
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          organization_id: orgId,
          organization_name: orgName,

          creator_id: creatorId,
          creator_email: creatorEmail,

          users,

          ...item
        }): UsersGroupTableRowWithRelations => ({
          ...camelcaseKeys(item),
          creator: {
            id: creatorId,
            email: creatorEmail,
          },
          organization: {
            id: orgId,
            name: orgName,
          },
          users: users ?? [],
        })),
      ),
    );
  };
}
