import camelcaseKeys from 'camelcase-keys';
import { array as A, nonEmptyArray as NEA, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { injectable } from 'tsyringe';

import type {
  SdkPermissionResourceT,
  SdkPermissionResourceTypeT,
  SdkUpsertResourcePermissionsInputT,
} from '@llm/sdk';

import type { PermissionInsertTableRow, PermissionTableRowWithRelations } from './permissions.tables';

import {
  createProtectedDatabaseRepo,
  DatabaseError,
  type TableId,
  type TransactionalAttrs,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '../database';

@injectable()
export class PermissionsRepo extends createProtectedDatabaseRepo('permissions') {
  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('permissions.id', 'in', ids)
            .leftJoin('users', 'users.id', 'user_id')
            .leftJoin('users_groups', 'users_groups.id', 'group_id')
            .select([
              'permissions.id',

              'permissions.project_id',
              'permissions.app_id',
              'permissions.chat_id',

              'permissions.created_at',
              'permissions.updated_at',
              'permissions.access_level',

              'user_id as user_id',
              'users.email as user_email',
              'group_id as group_id',
              'users_groups.name as group_name',

              eb => eb
                .selectFrom('users_groups_users')
                .where('users_groups_users.group_id', '=', eb.ref('users_groups.id'))
                .innerJoin('users as group_users', 'group_users.id', 'users_groups_users.user_id')
                .select(eb => [
                  eb.fn
                    .jsonAgg(
                      jsonBuildObject({
                        id: eb.ref('group_users.id').$notNull(),
                        email: eb.ref('group_users.email').$notNull(),
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
        A.filterMap(({
          user_id: userId,
          user_email: userEmail,
          group_id: groupId,
          group_name: groupName,

          project_id: projectId,
          app_id: appId,
          chat_id: chatId,

          users,
          ...item
        }): O.Option<PermissionTableRowWithRelations> => {
          if (!projectId && !appId && !chatId) {
            return O.none;
          }

          const record = {
            ...camelcaseKeys(item),
            project: projectId ? { id: projectId } : null,
            app: appId ? { id: appId } : null,
            chat: chatId ? { id: chatId } : null,
            group: null,
            user: null,
          };

          if (groupId) {
            return O.some({
              ...record,
              group: {
                id: groupId,
                name: groupName!,
                users: users ?? [],
              },
            });
          }

          if (userId) {
            return O.some({
              ...record,
              user: { id: userId, email: userEmail! },
            });
          }

          return O.none;
        }),
      ),
    );
  };

  upsert = (
    {
      forwardTransaction,
      value: {
        permissions,
        resource,
      },
    }: TransactionalAttrs<{
      value: {
        permissions: SdkUpsertResourcePermissionsInputT;
        resource: SdkPermissionResourceT;
      };
    }>,
  ) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });

    return transaction(trx => pipe(
      this.deleteAllResourcePermissions({
        forwardTransaction: trx,
        resource,
      }),
      TE.tap(() => {
        const maybeNonEmptyPermissions = NEA.fromArray(permissions);

        if (O.isNone(maybeNonEmptyPermissions)) {
          return TE.of(undefined);
        }

        const insertRows = pipe(
          maybeNonEmptyPermissions.value,
          NEA.map((permission): PermissionInsertTableRow => ({
            accessLevel: permission.accessLevel,
            projectId: resource.type === 'project' ? resource.id : null,
            appId: resource.type === 'app' ? resource.id : null,
            chatId: resource.type === 'chat' ? resource.id : null,
          })),
        );

        return this.baseRepo.createBulk({
          forwardTransaction: trx,
          values: insertRows,
        });
      }),
    ));
  };

  deleteAllResourcePermissions = (
    {
      forwardTransaction,
      resource,
    }: TransactionalAttrs<{
      resource: SdkPermissionResourceT;
    }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(async (qb) => {
        return qb
          .deleteFrom(this.table)
          .where(mapResourceTypeToColumn(resource.type), '=', resource.id)
          .returning('id')
          .execute();
      }),
      DatabaseError.tryTask,
    );
  };

  createIdsIterator = this.baseRepo.createIdsIterator;

  createResourceIdsIterator = (
    {
      resource,
      chunkSize = 100,
    }: {
      resource: SdkPermissionResourceT;
      chunkSize?: number;
    },
  ) =>
    this.createIdsIterator({
      chunkSize,
      where: [
        [`${resource.type}Id`, '=', resource.id],
      ],
    });
}

function mapResourceTypeToColumn(type: SdkPermissionResourceTypeT) {
  switch (type) {
    case 'project':
      return 'project_id';

    case 'app':
      return 'app_id';

    case 'chat':
      return 'chat_id';

    default: {
      const _: never = type;

      throw new Error('Unknown resource type!');
    }
  }
}
