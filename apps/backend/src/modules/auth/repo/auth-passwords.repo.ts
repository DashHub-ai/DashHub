import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import type { SdkTableRowWithIdT } from '@dashhub/sdk';

import {
  createDatabaseRepo,
  DatabaseError,
  type KyselyQueryCreator,
  type TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import { tryEncryptPassword } from '../helpers';

@injectable()
export class AuthPasswordsRepo extends createDatabaseRepo('auth_passwords') {
  createEncryptedUserPassword = (
    {
      user,
      password,
      forwardTransaction,
    }: TransactionalAttrs<{ user: SdkTableRowWithIdT; password: string; }>,
  ) => pipe(
    tryEncryptPassword(password),
    TE.chainW(({ hash, salt }) => this.create({
      forwardTransaction,
      value: {
        userId: user.id,
        hash,
        salt,
      },
    })),
  );

  getPasswordHashByEmail = ({ email, forwardTransaction }: TransactionalAttrs<{ email: string; }>) => {
    const task = async (qb: KyselyQueryCreator) =>
      qb
        .selectFrom('auth_passwords')
        .leftJoin('users', 'users.id', 'user_id')
        .where('users.email', '=', email)
        .where('users.active', '=', true)
        .select(['salt', 'hash', 'user_id as userId'])
        .limit(1)
        .executeTakeFirstOrThrow();

    return pipe(
      task,
      tryReuseTransactionOrSkip({ db: this.db, forwardTransaction }),
      DatabaseError.tryTask,
    );
  };
}
