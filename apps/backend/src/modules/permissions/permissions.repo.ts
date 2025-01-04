import camelcaseKeys from 'camelcase-keys';
import { array as A, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { injectable } from 'tsyringe';

import {
  createDatabaseRepo,
  DatabaseError,
  type TableId,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '../database';
import { PermissionTableRowWithRelations } from './permissions.tables';

@injectable()
export class PermissionsRepo extends createDatabaseRepo('permissions') {
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
}
