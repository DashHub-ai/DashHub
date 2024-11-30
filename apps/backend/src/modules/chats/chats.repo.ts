import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { RequiredBy } from '@llm/commons';

import { SdkCreateChatInputT } from '@llm/sdk';
import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseConnectionRepo,
  DatabaseError,
  TableUuid,
  TransactionalAttrs,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { ChatTableRowWithRelations } from './chats.tables';

import { ChatsSummariesRepo } from '../chats-summaries/chats-summaries.repo';

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

  create = (
    {
      forwardTransaction,
      value: {
        organization,
        creator,
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
            .selectAll('chats')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'users.id as creator_user_id',
              'users.email as creator_email',

              'chat_summaries.id as summary_id',

              'chat_summaries.content as summary_content',
              'chat_summaries.content_generated as summary_content_generated',
              'chat_summaries.content_generated_at as summary_content_generated_at',

              'chat_summaries.name as summary_name',
              'chat_summaries.name_generated as summary_name_generated',
              'chat_summaries.name_generated_at as summary_name_generated_at',
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

          summary_id: summaryId,
          summary_content: summaryContent,
          summary_content_generated: summaryContentGenerated,
          summary_content_generated_at: summaryContentGeneratedAt,

          summary_name: summaryName,
          summary_name_generated: summaryNameGenerated,
          summary_name_generated_at: summaryNameGeneratedAt,

          ...item
        }): ChatTableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: {
            id: orgId,
            name: orgName,
          },
          creator: {
            id: creatorUserId,
            email: creatorEmail,
          },
          summary: {
            id: summaryId,

            content: summaryContent,
            contentGenerated: summaryContentGenerated,
            contentGeneratedAt: summaryContentGeneratedAt,

            name: summaryName,
            nameGenerated: summaryNameGenerated,
            nameGeneratedAt: summaryNameGeneratedAt,
          },
        })),
      ),
    );
  };
}
