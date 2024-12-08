import { pipe } from 'fp-ts/lib/function';
import { sql } from 'kysely';
import { injectable } from 'tsyringe';

import { SdkChatSummaryInputT } from '@llm/sdk';
import {
  createDatabaseRepo,
  DatabaseError,
  KyselyDatabase,
  type TableUuid,
  type TransactionalAttrs,
  tryGetFirstOrNotExists,
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
          .select(({ fn }) => fn.count<number>('summary.id').as('count'))
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
        .select(['summary.id', 'summary.chat_id as chatId'])
        .orderBy('summary.created_at', 'asc'),
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
    .selectFrom(`${this.table} as summary`)
    .innerJoin('chats as chat', 'chat.id', 'summary.chat_id')
    .where(({ and, or, eb }) => and([
      // Check if the chat is not internal
      eb('chat.internal', '=', false),

      // Check if something can be summarized
      or([
        eb('summary.content_generated', 'is', true),
        eb('summary.name_generated', 'is', true),
      ]),

      // Check if the chat was not summarized recently
      or([
        eb('summary.name_generated_at', 'is', null),
        eb('summary.content_generated_at', 'is', null),
        eb(
          sql`GREATEST(name_generated_at, content_generated_at)`,
          '<',
          sql`NOW() - interval '15 minutes'`,
        ),
      ]),

      // Check if there is message younger than the last summary
      or([
        eb('summary.last_summarized_message_id', 'is', null),
        eb.exists(
          this.db
            .selectFrom('messages')
            .select('messages.id')
            .where('messages.chat_id', '=', eb.ref('summary.chat_id'))
            .where('messages.created_at', '>', sql<Date>`GREATEST(name_generated_at, content_generated_at)`),
        ),

      ]),

      // At least one AI message was sent, so we can pick model from it
      eb.exists(
        this.db
          .selectFrom('messages')
          .select('messages.id')
          .where('messages.chat_id', '=', eb.ref('summary.chat_id'))
          .where('messages.role', '=', 'assistant')
          .where('messages.ai_model_id', 'is not', null),
      ),
    ]));

  updateByChatId = ({ forwardTransaction, id, value }: TransactionalAttrs<{ id: TableUuid; value: SdkChatSummaryInputT; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(async qb =>
        qb
          .updateTable(this.table)
          .where('chat_id', '=', id)
          .set({
            last_summarized_message_id: null,

            ...value.content && {
              content: value?.content.value,
              content_generated: value.content.generated,
              content_generated_at: null,
            },

            ...value.name && {
              name: value.name.value,
              name_generated: value.name.generated,
              name_generated_at: null,
            },
          })
          .returning('chat_id as id')
          .execute(),
      ),
      DatabaseError.tryTask,
      tryGetFirstOrNotExists,
    );
  };
}
