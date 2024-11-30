import { pipe } from 'fp-ts/lib/function';
import { sql } from 'kysely';
import { injectable } from 'tsyringe';

import {
  createDatabaseRepo,
  DatabaseError,
  KyselyDatabase,
  type TableUuid,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

@injectable()
export class ChatsSummariesRepo extends createDatabaseRepo('chat_summaries') {
  getTotalChatsToSummarize = (attrs?: TransactionalAttrs) => {
    const transaction = tryReuseTransactionOrSkip({
      db: this.db,
      forwardTransaction: attrs?.forwardTransaction,
    });

    return pipe(
      transaction(qb =>
        this
          .createSummarizeChatsQuery(qb)
          .select(({ fn }) => fn.count<number>('id').as('count'))
          .executeTakeFirstOrThrow()
          .then(result => +result.count as number),
      ),
      DatabaseError.tryTask,
    );
  };

  createChatsToSummarizeIterator = () =>
    pipe(
      this
        .createSummarizeChatsQuery()
        .select(['id', 'chat_id as chatId'])
        .orderBy('created_at', 'asc'),
      this.queryBuilder.createChunkedIterator({
        chunkSize: 100,
      }),
    );

  updateGeneratedSummarizeByChatId = (
    {
      forwardTransaction,
      chatId,
      name,
      content,
    }: TransactionalAttrs<{
      chatId: TableUuid;
      name: string;
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
              .where('chat_id', '=', chatId)
              .select(['id as lastMessageId'])
              .$castTo<{ lastMessageId: TableUuid; }>()
              .orderBy('created_at', 'desc')
              .limit(1),

            name: eb
              .case()
              .when('name_generated', '=', true)
              .then(name)
              .else(eb.ref('name'))
              .end(),

            name_generated_at: eb
              .case()
              .when('name_generated', '=', true)
              .then(sql<Date>`NOW()`)
              .else(eb.ref('name_generated_at'))
              .end(),

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
          .where('chat_id', '=', chatId)
          .execute(),
      ),
      DatabaseError.tryTask,
    );
  };

  private createSummarizeChatsQuery = (qb: KyselyDatabase = this.db) => qb
    .selectFrom(this.table)
    .where(({ and, or, eb }) => and([
      // Check if something can be summarized
      or([
        eb('content_generated', 'is', true),
        eb('name_generated', 'is', true),
      ]),

      // Check if the chat was not summarized recently
      or([
        eb('name_generated_at', 'is', null),
        eb('content_generated_at', 'is', null),
        eb(
          sql`GREATEST(name_generated_at, content_generated_at)`,
          '<',
          sql`NOW() - interval '15 minutes'`,
        ),
      ]),

      // Check if there is message younger than the last summary
      or([
        eb('last_summarized_message_id', 'is', null),
        eb.exists(
          this.db
            .selectFrom('messages')
            .select('id')
            .where('chat_id', '=', eb.ref('chat_summaries.chat_id'))
            .where('created_at', '>', sql<Date>`GREATEST(name_generated_at, content_generated_at)`),
        ),

      ]),

      // At least one AI message was sent, so we can pick model from it
      eb.exists(
        this.db
          .selectFrom('messages')
          .select('id')
          .where('chat_id', '=', eb.ref('chat_summaries.chat_id'))
          .where('role', '=', 'assistant')
          .where('ai_model_id', 'is not', null),
      ),
    ]));
}
