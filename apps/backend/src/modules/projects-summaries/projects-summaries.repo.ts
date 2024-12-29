import { pipe } from 'fp-ts/lib/function';
import { sql } from 'kysely';
import { injectable } from 'tsyringe';

import { SdkProjectSummaryInputT } from '@llm/sdk';
import {
  createDatabaseRepo,
  DatabaseError,
  KyselyDatabase,
  type TableId,
  type TableUuid,
  type TransactionalAttrs,
  tryGetFirstOrNotExists,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

@injectable()
export class ProjectsSummariesRepo extends createDatabaseRepo('projects_summaries') {
  getTotalProjectsToSummarize = (attrs?: TransactionalAttrs) => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction: attrs?.forwardTransaction,
    });

    return pipe(
      transaction(qb =>
        this
          .createSummarizeProjectsQuery(qb)
          .select(({ fn }) => fn.count<number>('summary.id').as('count'))
          .executeTakeFirstOrThrow()
          .then(result => +result.count as number),
      ),
      DatabaseError.tryTask,
    );
  };

  createProjectsToSummarizeIterator = () =>
    pipe(
      this
        .createSummarizeProjectsQuery()
        .select(['summary.id', 'summary.project_id as projectId'])
        .orderBy('summary.created_at', 'asc'),
      this.queryBuilder.createChunkedIterator({
        chunkSize: 100,
      }),
    );

  updateGeneratedSummarizeByProjectId = (
    {
      forwardTransaction,
      projectId,
      content,
    }: TransactionalAttrs<{
      projectId: TableId;
      content: string;
    }>,
  ) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(async qb =>
        qb
          .updateTable(this.table)
          .set(eb => ({
            last_summarized_message_id: eb
              .selectFrom('messages')
              .innerJoin('chats', 'chats.id', 'messages.chat_id')
              .where('chats.project_id', '=', projectId)
              .select(['messages.id as lastMessageId'])
              .$castTo<{ lastMessageId: TableUuid; }>()
              .orderBy('messages.created_at', 'desc')
              .limit(1),

            content: eb
              .case()
              .when('content_generated', '=', true)
              .then(content)
              .else(eb.ref('content'))
              .end(),

            content_generated_at: eb
              .case()
              .when('content_generated', '=', true)
              .then(sql<Date>`NOW()`)
              .else(eb.ref('content_generated_at'))
              .end(),
          }))
          .where('project_id', '=', projectId)
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };

  private createSummarizeProjectsQuery = (qb: KyselyDatabase = this.db) => qb
    .selectFrom(`${this.table} as summary`)
    .innerJoin('projects as project', 'project.id', 'summary.project_id')
    .where(({ and, or, eb }) => and([
      // Check if the project is not internal or archived
      eb('project.internal', '=', false),
      eb('project.archived', '=', false),

      // Check if something can be summarized
      eb('summary.content_generated', 'is', true),

      // Check if the project was not summarized recently
      or([
        eb('summary.content_generated_at', 'is', null),
        eb('summary.content_generated_at', '<', sql<Date>`NOW() - interval '15 minutes'`),
      ]),

      // Check if there is message younger than the last summary
      or([
        eb('summary.last_summarized_message_id', 'is', null),
        eb.exists(
          this.db
            .selectFrom('messages')
            .select('messages.id')
            .innerJoin('chats', 'chats.id', 'messages.chat_id')
            .where('chats.project_id', '=', eb.ref('summary.project_id'))
            .where('messages.created_at', '>', eb.ref('summary.content_generated_at')),
        ),

      ]),

      // At least one AI message was sent, so we can pick model from it
      eb.exists(
        this.db
          .selectFrom('messages')
          .select('messages.id')
          .innerJoin('chats', 'chats.id', 'messages.chat_id')
          .where('chats.project_id', '=', eb.ref('summary.project_id'))
          .where('messages.role', '=', 'assistant')
          .where('messages.ai_model_id', 'is not', null),
      ),
    ]));

  updateByProjectId = ({ forwardTransaction, id, value }: TransactionalAttrs<{ id: TableId; value: SdkProjectSummaryInputT; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(async qb =>
        qb
          .updateTable(this.table)
          .where('project_id', '=', id)
          .set({
            last_summarized_message_id: null,

            ...value.content && {
              content: value.content.value,
              content_generated: value.content.generated,
              content_generated_at: null,
            },
          })
          .returning('project_id as id')
          .execute(),
      ),
      DatabaseError.tryTask,
      tryGetFirstOrNotExists,
    );
  };
}
