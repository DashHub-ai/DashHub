import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateUsersGroupInputT, SdkUpdateUsersGroupInputT } from '@llm/sdk';

import type { UsersGroupTableRowWithRelations } from '../users-groups.tables';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseConnectionRepo,
  DatabaseError,
  type TableId,
  type TableRowWithId,
  type TransactionalAttrs,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '../../database';
import { UsersGroupsUsersRepo } from './users-groups-users.repo';

@injectable()
export class UsersGroupsRepo extends createProtectedDatabaseRepo('users_groups') {
  constructor(
    @inject(DatabaseConnectionRepo) connectionRepo: DatabaseConnectionRepo,
    @inject(UsersGroupsUsersRepo) private readonly usersGroupsUsersRepo: UsersGroupsUsersRepo,
  ) {
    super(connectionRepo);
  }

  createIdsIterator = this.baseRepo.createIdsIterator;

  archive = createArchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

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

  create = (
    {
      forwardTransaction,
      value: {
        users,
        creator,
        organization,
        ...attrs
      },
    }: TransactionalAttrs<{
      value: SdkCreateUsersGroupInputT & {
        creator: TableRowWithId;
      };
    }>,
  ) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.baseRepo.create({
        value: {
          ...attrs,
          creatorUserId: creator.id,
          organizationId: organization.id,
        },
        forwardTransaction: trx,
      }),
      TE.tap(group => this.usersGroupsUsersRepo.updateGroupUsers({
        forwardTransaction: trx,
        group,
        users,
      })),
    ));
  };

  update = (
    {
      forwardTransaction,
      id,
      value: {
        users,
        ...attrs
      },
    }: TransactionalAttrs<{
      id: TableId;
      value: SdkUpdateUsersGroupInputT;
    }>,
  ) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.baseRepo.update({
        id,
        value: attrs,
        forwardTransaction: trx,
      }),
      TE.tap(group => this.usersGroupsUsersRepo.updateGroupUsers({
        forwardTransaction: trx,
        group,
        users,
      })),
    ));
  };
}
