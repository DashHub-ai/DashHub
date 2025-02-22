import { array as A, option as O, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import { groupByFlatProp, pluckTyped } from '@llm/commons';
import {
  createDatabaseRepo,
  DatabaseConnectionRepo,
  DatabaseError,
  type TableId,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { MessagesRepo } from '../messages';
import { PinnedMessageTableRowWithRelations } from './pinned-messages.tables';

@injectable()
export class PinnedMessagesRepo extends createDatabaseRepo('pinned_messages') {
  constructor(
    connectionRepo: DatabaseConnectionRepo,
    @inject(MessagesRepo) private readonly messagesRepo: MessagesRepo,
  ) {
    super(connectionRepo);
  }

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
