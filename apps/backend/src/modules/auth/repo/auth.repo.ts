import { taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateUserAuthMethodsT, SdkTableRowWithIdT } from '@llm/sdk';

import { DatabaseConnectionRepo, type TransactionalAttrs, tryReuseOrCreateTransaction } from '~/modules/database';

import { AuthEmailsRepo } from './auth-emails.repo';
import { AuthPasswordsRepo } from './auth-passwords.repo';
import { AuthResetPasswordsRepo } from './auth-reset-passwords.repo';

export type UpsertUserAuthMethodsAttrs = TransactionalAttrs &
  SdkCreateUserAuthMethodsT &
  {
    user: SdkTableRowWithIdT;
  };

@injectable()
export class AuthRepo {
  constructor(
    @inject(DatabaseConnectionRepo) private readonly databaseConnectionRepo: DatabaseConnectionRepo,
    @inject(AuthEmailsRepo) private readonly authEmailsRepo: AuthEmailsRepo,
    @inject(AuthPasswordsRepo) private readonly authPasswordsRepo: AuthPasswordsRepo,
    @inject(AuthResetPasswordsRepo) private readonly authResetPasswordsRepo: AuthResetPasswordsRepo,
  ) {}

  upsertUserAuthMethods = (
    {
      user,
      email,
      password,
      forwardTransaction,
    }: UpsertUserAuthMethodsAttrs,
  ) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.databaseConnectionRepo.connection,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.removeUserAuthMethods(
        {
          forwardTransaction: trx,
          user,
        },
      ),
      TE.chainW(() => {
        if (!email) {
          return TE.of(undefined);
        }

        return this.authEmailsRepo.create({
          forwardTransaction: trx,
          value: {
            userId: user.id,
          },
        });
      }),
      TE.chainW(() => {
        if (!password) {
          return TE.of(undefined);
        }

        return this.authPasswordsRepo.createEncryptedUserPassword({
          forwardTransaction: trx,
          password: password.value,
          user,
        });
      }),
    ));
  };

  private removeUserAuthMethods = (
    {
      user,
      forwardTransaction,
    }: TransactionalAttrs<{ user: SdkTableRowWithIdT; }>,
  ) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.databaseConnectionRepo.connection,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.authEmailsRepo.deleteAll({
        forwardTransaction: trx,
        where: [
          ['userId', '=', user.id],
        ],
      }),
      TE.chain(() => this.authPasswordsRepo.deleteAll({
        forwardTransaction: trx,
        where: [
          ['userId', '=', user.id],
        ],
      })),
      TE.chain(() => this.authResetPasswordsRepo.deleteAll({
        forwardTransaction: trx,
        where: [
          ['userId', '=', user.id],
        ],
      })),
    ));
  };
}
