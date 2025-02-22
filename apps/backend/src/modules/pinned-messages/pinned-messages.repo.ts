import { array as A, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkPinMessageInputT } from '@llm/sdk';

import { groupByFlatProp, Overwrite, pluckTyped } from '@llm/commons';
import {
  createProtectedDatabaseRepo,
  DatabaseConnectionRepo,
  DatabaseError,
  type TableId,
  TableRowWithId,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { MessagesRepo } from '../messages';
import { PinnedMessageTableRowWithRelations } from './pinned-messages.tables';

@injectable()
export class PinnedMessagesRepo extends createProtectedDatabaseRepo('pinned_messages') {
  constructor(
    connectionRepo: DatabaseConnectionRepo,
    @inject(MessagesRepo) private readonly messagesRepo: MessagesRepo,
  ) {
    super(connectionRepo);
  }

  createIdsIterator = this.baseRepo.createIdsIterator;

  delete = this.baseRepo.delete;

  create = ({ forwardTransaction, value }: TransactionalAttrs<{ value: InternalCreatePinnedMessageInputT; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(trx =>
        trx
          .insertInto(this.table)
          .values({
            creator_user_id: value.creator.id,
            message_id: value.messageId,
          })
          .returning('id')
          .onConflict(
            oc => oc
              .columns(['creator_user_id', 'message_id'])
              .doUpdateSet(eb => ({
                updated_at: eb.fn('now'),
              })),
          )
          .executeTakeFirstOrThrow(),
      ),
      DatabaseError.tryTask,
    );
  };

  findAll = ({ creator, forwardTransaction }: TransactionalAttrs<{ creator: TableRowWithId; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      DatabaseError.tryTask(
        transaction(qb => qb
          .selectFrom(this.table)
          .where('creator_user_id', '=', creator.id)
          .select([
            'id',
            'message_id',
          ])
          .execute(),
        ),
      ),
      TE.map(A.map(row => ({
        id: row.id,
        messageId: row.message_id,
      }))),
    );
  };

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      TE.Do,
      TE.bind('pinnedMessages', () => DatabaseError.tryTask(
        transaction(qb => qb
          .selectFrom(this.table)
          .where('pinned_messages.id', 'in', ids)
          .innerJoin('users', 'users.id', 'creator_user_id')
          .select([
            'users.id as creator_user_id',
            'users.email as creator_user_email',
            'users.name as creator_user_name',
          ])
          .selectAll(['pinned_messages'])
          .limit(ids.length)
          .execute(),
        ),
      )),
      TE.bind('extendedMessages', ({ pinnedMessages }) => pipe(
        this.messagesRepo.findWithRelationsByIds({
          ids: pipe(pinnedMessages, pluckTyped('message_id')),
        }),
        TE.map(groupByFlatProp('id')),
      )),
      TE.map(({ pinnedMessages, extendedMessages }) => pipe(
        pinnedMessages,
        A.filterMap((message): O.Option<PinnedMessageTableRowWithRelations> => {
          const matchedMessage = extendedMessages[message.message_id];

          if (!matchedMessage) {
            return O.none;
          }

          return O.some({
            id: message.id,
            createdAt: message.created_at,
            updatedAt: message.updated_at,
            message: matchedMessage,
            creator: {
              id: message.creator_user_id,
              email: message.creator_user_email,
              name: message.creator_user_name,
            },
          });
        }),
      )),
    );
  };
}

export type InternalCreatePinnedMessageInputT = Overwrite<SdkPinMessageInputT, {
  creator: TableRowWithId;
}>;
