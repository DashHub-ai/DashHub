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
import { ProjectPolicyTableRowWithRelations } from './projects-policies.tables';

@injectable()
export class ProjectsPoliciesRepo extends createDatabaseRepo('projects_policies') {
  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('projects_policies.id', 'in', ids)
            .innerJoin('projects', 'projects.id', 'project_id')

            .leftJoin('users', 'users.id', 'user_id')
            .leftJoin('users_groups', 'users_groups.id', 'group_id')

            .selectAll('projects_policies')
            .select([
              'user_id as user_id',
              'users.email as user_email',

              'group_id as group_id',
              'users_groups.name as group_name',

              'projects.id as project_id',
              'projects.name as project_name',

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
          project_id: projectId,
          project_name: projectName,

          user_id: userId,
          user_email: userEmail,

          group_id: groupId,
          group_name: groupName,

          users,

          ...item
        }): O.Option<ProjectPolicyTableRowWithRelations> => {
          const record = {
            id: item.id,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            accessLevel: item.access_level,
            group: null,
            user: null,
            project: {
              id: projectId,
              name: projectName,
            },
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
