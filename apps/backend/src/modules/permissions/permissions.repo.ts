import { array as A, nonEmptyArray as NEA, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { type ExpressionBuilder, sql } from 'kysely';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { injectable } from 'tsyringe';

import type {
  SdkPermissionResourceT,
  SdkPermissionResourceTypeT,
  SdkUpsertPermissionsT,
} from '@llm/sdk';

import type { PermissionInsertTableRow } from './permissions.tables';

import {
  createProtectedDatabaseRepo,
  DatabaseError,
  type TableId,
  type TableUuid,
  type TransactionalAttrs,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '../database';
import { PermissionsTableRowRawAggRelation } from './record-protection';

@injectable()
export class PermissionsRepo extends createProtectedDatabaseRepo('permissions') {
  static createPermissionAggQuery = <Q extends ExpressionBuilder<any, any>>(qb: Q) =>
    qb
      .selectFrom('permissions')
      .leftJoin('users_groups', 'users_groups.id', 'permissions.group_id')
      .leftJoin('users', 'users.id', 'permissions.user_id')

      .leftJoin('s3_resources', 's3_resources.id', 'users.avatar_s3_resource_id')
      .leftJoin('s3_resources_buckets', 's3_resources_buckets.id', 's3_resources.bucket_id')

      .select(neb => [
        neb.fn.jsonAgg(
          jsonBuildObject({
            access_level: neb.ref('permissions.access_level'),

            group_id: neb.ref('permissions.group_id'),
            group_name: neb.ref('users_groups.name'),

            user_id: neb.ref('permissions.user_id'),
            user_email: neb.ref('users.email'),
            user_name: neb.ref('users.name'),
            user_avatar_url: sql<string>`${neb.ref('s3_resources_buckets.public_base_url')} || '/' || ${neb.ref('s3_resources.s3_key')}`,
          }),
        )
          .$castTo<PermissionsTableRowRawAggRelation[]>()
          .as('permissions_json'),
      ]);

  upsert = (
    {
      forwardTransaction,
      value: {
        permissions,
        resource,
      },
    }: TransactionalAttrs<{
      value: {
        permissions: SdkUpsertPermissionsT;
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
          NEA.map(({ accessLevel, target }): PermissionInsertTableRow => ({
            accessLevel,

            // Target
            ...'user' in target
              ? { userId: target.user.id }
              : { groupId: target.group.id },

            // Resources
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

  deleteUserExternalResourcesPermissions = (
    {
      forwardTransaction,
      userId,
    }: TransactionalAttrs<{
      userId: TableId;
    }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(async qb =>
        qb
          .deleteFrom(this.table)
          .where('user_id', '=', userId)
          .where(eb => eb.or([
            eb('project_id', 'is not', null),
            eb('app_id', 'is not', null),
          ]))
          .where(eb => eb.and([
            eb.not(
              eb.exists(
                eb.selectFrom('projects')
                  .where('projects.id', '=', eb.ref('permissions.project_id'))
                  .where('projects.creator_user_id', '=', userId),
              ),
            ),
            eb.not(
              eb.exists(
                eb.selectFrom('chats')
                  .where('chats.id', '=', eb.ref('permissions.chat_id'))
                  .where('chats.creator_user_id', '=', userId),
              ),
            ),
          ]))
          .returning([
            'id',
            'project_id as projectId',
            'app_id as appId',
            'chat_id as chatId',
          ])
          .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.reduce(
          {
            projectsIds: [] as TableId[],
            appsIds: [] as TableId[],
            chatsIds: [] as TableUuid[],
          },
          (acc, { projectId, appId, chatId }) => ({
            ...acc,
            projectsIds: projectId ? [...acc.projectsIds, projectId] : acc.projectsIds,
            appsIds: appId ? [...acc.appsIds, appId] : acc.appsIds,
            chatsIds: chatId ? [...acc.chatsIds, chatId] : acc.chatsIds,
          }),
        ),
      ),
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
