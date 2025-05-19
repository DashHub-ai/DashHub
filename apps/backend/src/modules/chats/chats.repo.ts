import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { identity, pipe } from 'fp-ts/lib/function';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { inject, injectable } from 'tsyringe';

import type { RequiredBy } from '@dashhub/commons';
import type { SdkCreateChatInputT, SdkUpdateChatInputT } from '@dashhub/sdk';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseConnectionRepo,
  DatabaseError,
  TableId,
  TableUuid,
  TransactionalAttrs,
  tryGetFirstOrNotExists,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { ChatTableRowWithRelations } from './chats.tables';

import { ChatsSummariesRepo } from '../chats-summaries/chats-summaries.repo';
import {
  mapRawJSONAggRelationToSdkPermissions,
  PermissionsRepo,
  prependCreatorIfNonPublicPermissions,
} from '../permissions';

@injectable()
export class ChatsRepo extends createProtectedDatabaseRepo('chats') {
  constructor(
    @inject(DatabaseConnectionRepo) connectionRepo: DatabaseConnectionRepo,
    @inject(ChatsSummariesRepo) private readonly summariesRepo: ChatsSummariesRepo,
  ) {
    super(connectionRepo);
  }

  createIdsIterator = this.baseRepo.createIdsIterator;

  archive = createArchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  findById = this.baseRepo.findById;

  create = (
    {
      forwardTransaction,
      value: {
        organization,
        creator,
        project,
        summary = {
          content: { generated: true },
          name: { generated: true },
        },
        ...value
      },
    }: TransactionalAttrs<{ value: RequiredBy<SdkCreateChatInputT, 'organization' | 'creator'>; }>,
  ) => {
    const transaction = tryReuseOrCreateTransaction({ db: this.db, forwardTransaction });

    return transaction(trx => pipe(
      this.baseRepo.create({
        forwardTransaction: trx,
        value: {
          ...value,
          organizationId: organization.id,
          creatorUserId: creator.id,
          projectId: project?.id,
        },
      }),
      TE.tap(({ id }) => this.summariesRepo.create({
        forwardTransaction: trx,
        value: {
          chatId: id,
          contentGenerated: summary.content?.generated ?? true,
          content: summary.content?.value,
          nameGenerated: summary.name?.generated ?? true,
          name: summary.name?.value,
        },
      })),
    ));
  };

  getFileEmbeddingAIModelId = ({ forwardTransaction, id }: TransactionalAttrs<{ id: TableUuid; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        qb =>
          qb
            .selectFrom(this.table)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .innerJoin('ai_models', 'ai_models.organization_id', 'organizations.id')
            .where(eb => eb
              .and([
                eb('chats.id', '=', id),
                eb('ai_models.embedding', '=', true),
              ]),
            )
            .select([
              'ai_models.id as id',
              'project_id as projectId',
            ])
            .limit(1)
            .execute(),
      ),
      DatabaseError.tryTask,
      tryGetFirstOrNotExists,
    );
  };

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableUuid[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('chats.id', 'in', ids)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .innerJoin('users', 'users.id', 'creator_user_id')
            .innerJoin('chat_summaries', 'chat_summaries.chat_id', 'chats.id')

            .leftJoin('projects', 'projects.id', 'project_id')
            .leftJoin('users as project_creator', 'project_creator.id', 'projects.creator_user_id')

            .selectAll('chats')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'users.id as creator_user_id',
              'users.email as creator_email',
              'users.name as creator_name',

              'chat_summaries.id as summary_id',
              'chat_summaries.content as summary_content',
              'chat_summaries.content_generated as summary_content_generated',
              'chat_summaries.content_generated_at as summary_content_generated_at',
              'chat_summaries.name as summary_name',
              'chat_summaries.name_generated as summary_name_generated',
              'chat_summaries.name_generated_at as summary_name_generated_at',

              'projects.id as project_id',
              'projects.name as project_name',
              'projects.internal as project_internal',

              'project_creator.id as project_creator_user_id',
              'project_creator.email as project_creator_email',
              'project_creator.name as project_creator_name',

              eb =>
                PermissionsRepo
                  .createPermissionAggQuery(eb)
                  .where('permissions.project_id', 'is not', null)
                  .where('permissions.project_id', '=', eb.ref('projects.id'))
                  .as('project_permissions_json'),

              eb =>
                PermissionsRepo
                  .createPermissionAggQuery(eb)
                  .where('permissions.chat_id', '=', eb.ref('chats.id'))
                  .as('permissions_json'),

              eb =>
                eb.selectFrom('messages')
                  .where('messages.chat_id', '=', eb.ref('chats.id'))
                  .where('messages.role', '!=', 'system')
                  .select(({ fn }) => fn.count('id').as('count'))
                  .as('messages_count'),

              eb =>
                eb.selectFrom('messages')
                  .where('messages.chat_id', '=', eb.ref('chats.id'))
                  .where('messages.role', '=', 'system')
                  .where('app_id', 'is not', null)
                  .leftJoin('apps', 'apps.id', 'messages.app_id')
                  .select(({ fn, eb }) =>
                    fn.jsonAgg(
                      jsonBuildObject({
                        id: eb.ref('messages.app_id').$notNull(),
                        aiExternalApiId: eb.ref('apps.ai_external_api_id'),
                      }),
                    ).as('app_data'),
                  )
                  .as('apps'),
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          organization_id: orgId,
          organization_name: orgName,

          creator_user_id: creatorUserId,
          creator_email: creatorEmail,
          creator_name: creatorName,

          summary_id: summaryId,
          summary_content: summaryContent,
          summary_content_generated: summaryContentGenerated,
          summary_content_generated_at: summaryContentGeneratedAt,

          summary_name: summaryName,
          summary_name_generated: summaryNameGenerated,
          summary_name_generated_at: summaryNameGeneratedAt,

          project_id: projectId,
          project_name: projectName,
          project_internal: projectInternal,

          project_creator_user_id: projectCreatorUserId,
          project_creator_email: projectCreatorEmail,
          project_creator_name: projectCreatorName,

          project_permissions_json: projectPermissions,
          permissions_json: permissions,
          messages_count: messagesCount,

          apps,

          ...item
        }): ChatTableRowWithRelations => {
          const creator = {
            id: creatorUserId,
            email: creatorEmail,
            name: creatorName,
          };

          const projectCreator = projectCreatorUserId
            ? {
                id: projectCreatorUserId,
                email: projectCreatorEmail!,
                name: projectCreatorName!,
              }
            : null;

          return {
            ...camelcaseKeys(item),
            apps: (apps ?? []).map(app => ({
              id: app.id,
              aiExternalApi: app.aiExternalApiId
                ? {
                    id: app.aiExternalApiId,
                  }
                : null,
            })),
            project: projectId && projectName
              ? {
                  id: projectId,
                  name: projectName,
                  internal: !!projectInternal,
                }
              : null,
            organization: {
              id: orgId,
              name: orgName,
            },
            creator,
            summary: {
              id: summaryId,

              content: summaryContent,
              contentGenerated: summaryContentGenerated,
              contentGeneratedAt: summaryContentGeneratedAt,

              name: summaryName,
              nameGenerated: summaryNameGenerated,
              nameGeneratedAt: summaryNameGeneratedAt,
            },

            stats: {
              messages: {
                total: Number(messagesCount || 0),
              },
            },

            permissions: {
              inherited: pipe(
                (projectPermissions ?? []).map(mapRawJSONAggRelationToSdkPermissions),
                projectCreator
                  ? prependCreatorIfNonPublicPermissions(projectCreator)
                  : identity,
              ),
              current: pipe(
                (permissions || []).map(mapRawJSONAggRelationToSdkPermissions),
                prependCreatorIfNonPublicPermissions(creator),
              ),
            },
          };
        }),
      ),
    );
  };

  assignToProject = ({ forwardTransaction, id, projectId }: TransactionalAttrs<{ id: TableUuid; projectId: TableId; }>) =>
    this.baseRepo.update({
      forwardTransaction,
      id,
      value: {
        projectId,
      },
    });

  update = ({ forwardTransaction, id, value }: TransactionalAttrs<{ id: TableUuid; value: SdkUpdateChatInputT; }>) => {
    const { summary } = value;

    return this.summariesRepo.updateByChatId({
      id,
      forwardTransaction,
      value: summary,
    });
  };
}
