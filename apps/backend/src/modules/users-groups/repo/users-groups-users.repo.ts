import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import type { SdkTableRowIdT } from '@llm/sdk';

import { pluckTyped, tapTask, Time, wrapWithCache } from '@llm/commons';
import {
  AbstractDatabaseRepo,
  DatabaseError,
  TableRowWithId,
  TransactionalAttrs,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

@injectable()
export class UsersGroupsUsersRepo extends AbstractDatabaseRepo {
  updateGroupUsers = (
    {
      forwardTransaction,
      group,
      users,
    }: TransactionalAttrs<{
      group: TableRowWithId;
      users: TableRowWithId[];
    }>,
  ) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      async () => {
        await trx
          .deleteFrom('users_groups_users')
          .where('group_id', '=', group.id)
          .execute();

        if (users.length > 0) {
          await trx
            .insertInto('users_groups_users')
            .values(
              users.map(user => ({
                group_id: group.id,
                user_id: user.id,
              })),
            )
            .execute();
        }

        return {
          success: true,
        };
      },
      DatabaseError.tryTask,
      tapTask(this.getAllUsersGroupsIds.clear),
    ));
  };

  getAllUsersGroupsIds = wrapWithCache(
    ({ forwardTransaction, userId }: TransactionalAttrs<{ userId: SdkTableRowIdT; }>) => {
      const transaction = tryReuseTransactionOrSkip({
        db: this.db,
        forwardTransaction,
      });

      return pipe(
        transaction(
          async qb => qb
            .selectFrom('users_groups_users')
            .where('user_id', '=', userId)
            .select('group_id as id')
            .execute(),
        ),
        DatabaseError.tryNonErrorMappedTask,
        TE.map(pluckTyped('id')),
      );
    },
    {
      getKey: ({ userId }) => userId,
      ttlMs: Time.toMilliseconds.hours(3),
    },
  );
}
