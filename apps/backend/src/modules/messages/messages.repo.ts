import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { sql } from 'kysely';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { injectable } from 'tsyringe';

import {
  createDatabaseRepo,
  DatabaseError,
  type TableUuid,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { MessageTableRowWithRelations } from './messages.tables';

import { mapRawJSONAggRelationToSdkPermissions, PermissionsRepo, prependCreatorIfNonPublicPermissions } from '../permissions';

@injectable()
export class MessagesRepo extends createDatabaseRepo('messages') {
  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableUuid[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('messages.id', 'in', ids)

            .innerJoin('chats', 'chats.id', 'messages.chat_id')
            .innerJoin('users as chat_creator', 'chat_creator.id', 'chats.creator_user_id')

            .leftJoin('users', 'users.id', 'messages.creator_user_id')
            .leftJoin('ai_models', 'ai_models.id', 'messages.ai_model_id')
            .leftJoin('apps', 'apps.id', 'messages.app_id')

            .leftJoin('messages as reply_messages', 'reply_messages.id', 'messages.replied_message_id')
            .leftJoin('users as reply_users', 'reply_users.id', 'reply_messages.creator_user_id')

            .select([
              'chat_creator.id as chat_creator_user_id',
              'chat_creator.email as chat_creator_user_email',
              'chat_creator.name as chat_creator_user_name',

              'users.id as creator_user_id',
              'users.email as creator_email',
              'users.name as creator_name',

              'ai_models.id as ai_model_id',
              'ai_models.name as ai_model_name',

              'apps.id as app_id',
              'apps.name as app_name',

              'reply_messages.role as reply_message_role',
              'reply_messages.content as reply_message_content',

              'reply_users.id as reply_message_creator_user_id',
              'reply_users.email as reply_message_creator_email',
              'reply_users.name as reply_message_creator_name',

              eb =>
                PermissionsRepo
                  .createPermissionAggQuery(eb)
                  .where('permissions.project_id', 'is not', null)
                  .where('permissions.project_id', '=', eb.ref('chats.project_id'))
                  .as('chat_project_permissions_json'),

              eb =>
                PermissionsRepo
                  .createPermissionAggQuery(eb)
                  .where('permissions.chat_id', '=', eb.ref('chats.id'))
                  .as('chat_permissions_json'),

              eb => eb
                .selectFrom('projects_files')
                .leftJoin('s3_resources', 's3_resources.id', 'projects_files.s3_resource_id')
                .leftJoin('s3_resources_buckets', 's3_resources_buckets.id', 's3_resources.bucket_id')
                .where('projects_files.message_id', '=', eb.ref('messages.id'))
                .select(eb => [
                  eb.fn.coalesce(
                    eb.fn.jsonAgg(
                      jsonBuildObject({
                        id: eb.ref('projects_files.id'),
                        resource: jsonBuildObject({
                          id: eb.ref('s3_resources.id').$notNull(),
                          name: eb.ref('s3_resources.name').$notNull(),
                          type: eb.ref('s3_resources.type').$notNull(),
                          s3Key: eb.ref('s3_resources.s3_key').$notNull(),
                          createdAt: eb.ref('s3_resources.created_at').$notNull(),
                          updatedAt: eb.ref('s3_resources.updated_at').$notNull(),
                          publicUrl: sql<string>`${eb.ref('s3_resources_buckets.public_base_url')} || '/' || ${eb.ref('s3_resources.s3_key')}`,
                          bucket: jsonBuildObject({
                            id: eb.ref('s3_resources_buckets.id').$notNull(),
                            name: eb.ref('s3_resources_buckets.name').$notNull(),
                          }),
                        }),
                      }),
                    ),
                    sql`'[]'`,
                  )
                    .$notNull()
                    .as('files'),
                ])
                .as('files_json'),
            ])
            .selectAll('messages')
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          chat_id: chatId,

          chat_creator_user_id: chatCreatorUserId,
          chat_creator_user_email: chatCreatorUserEmail,
          chat_creator_user_name: chatCreatorUserName,

          creator_user_id: userId,
          creator_name: userName,
          creator_email: userEmail,

          ai_model_id: aiModelId,
          ai_model_name: aiModelName,

          replied_message_id: replyMessageId,
          reply_message_role: replyMessageRole,
          reply_message_content: replyMessageContent,

          reply_message_creator_user_id: replyMessageCreatorUserId,
          reply_message_creator_email: replyMessageCreatorEmail,
          reply_message_creator_name: replyMessageCreatorName,

          app_id: appId,
          app_name: appName,

          files_json: filesJson,

          chat_project_permissions_json: chatProjectPermissions,
          chat_permissions_json: chatPermissions,

          ...item
        }): MessageTableRowWithRelations => {
          const creator = {
            id: chatCreatorUserId,
            name: chatCreatorUserName,
            email: chatCreatorUserEmail,
          };

          return {
            ...camelcaseKeys(item),
            chat: {
              id: chatId,
              creator,
              permissions: {
                inherited: (chatProjectPermissions ?? []).map(mapRawJSONAggRelationToSdkPermissions),
                current: pipe(
                  (chatPermissions || []).map(mapRawJSONAggRelationToSdkPermissions),
                  prependCreatorIfNonPublicPermissions(creator),
                ),
              },
            },
            aiModel: aiModelId && aiModelName
              ? {
                  id: aiModelId,
                  name: aiModelName,
                }
              : null,
            creator: userId && userEmail && userName
              ? {
                  id: userId,
                  email: userEmail,
                  name: userName,
                }
              : null,
            repliedMessage: replyMessageId
              ? {
                  id: replyMessageId,
                  role: replyMessageRole!,
                  content: replyMessageContent!,
                  creator: replyMessageCreatorUserId && replyMessageCreatorEmail && replyMessageCreatorName
                    ? {
                        id: replyMessageCreatorUserId,
                        email: replyMessageCreatorEmail,
                        name: replyMessageCreatorName,
                      }
                    : null,
                }
              : null,
            app: appId && appName
              ? {
                  id: appId,
                  name: appName,
                }
              : null,
            files: filesJson ?? [],
          };
        }),
      ),
    );
  };
}
