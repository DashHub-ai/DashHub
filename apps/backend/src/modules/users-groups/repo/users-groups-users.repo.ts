import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  AbstractDatabaseRepo,
  DatabaseError,
  TableRowWithId,
  TransactionalAttrs,
  tryReuseOrCreateTransaction,
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
    ));
  };
}
