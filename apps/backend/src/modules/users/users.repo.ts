import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateUserInputT } from '@llm/sdk';

import { catchTaskEitherTagError, isNil } from '@llm/commons';
import {
  createProtectedDatabaseRepo,
  DatabaseConnectionRepo,
  DatabaseError,
  type KyselyQueryCreator,
  type TableId,
  type TransactionalAttrs,
  tryGetFirstOrNotExists,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { UserTableRowWithRelations } from './users.tables';

import { AuthRepo } from '../auth/repo/auth.repo';

@injectable()
export class UsersRepo extends createProtectedDatabaseRepo('users') {
  constructor(
    @inject(DatabaseConnectionRepo) databaseConnectionRepo: DatabaseConnectionRepo,
    @inject(AuthRepo) private readonly authRepo: AuthRepo,
  ) {
    super(databaseConnectionRepo);
  }

  createIdsIterator = this.baseRepo.createIdsIterator;

  isPresentOrThrow = this.baseRepo.isPresentOrThrow;

  updateJwtRefreshToken = (
    {
      forwardTransaction,
      id,
      refreshToken,
    }: TransactionalAttrs<{ id: TableId; refreshToken: string; }>,
  ) =>
    pipe(
      this.baseRepo.update({
        forwardTransaction,
        id,
        value: {
          jwtRefreshToken: refreshToken,
        },
      }),
      TE.map(() => refreshToken),
    );

  create = ({ forwardTransaction, value }: TransactionalAttrs<{ value: SdkCreateUserInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.baseRepo.create({
        forwardTransaction: trx,
        value: {
          email: value.email,
          active: value.active,
          role: value.role,
        },
      }),
      TE.tap(({ id }) => pipe(
        this.authRepo.upsertUserAuthMethods({
          forwardTransaction: trx,
          user: { id },
          email: value.auth.email,
          password: value.auth.password,
        }),
      )),
    ));
  };

  createIfNotExists = ({ forwardTransaction, value }: TransactionalAttrs<{ value: SdkCreateUserInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.baseRepo.findOne({
        forwardTransaction: trx,
        select: ['id'],
        where: [
          ['email', '=', value.email],
        ],
      }),
      TE.map(result => ({
        ...result,
        created: false,
      })),
      catchTaskEitherTagError('DatabaseRecordNotExists')(() => pipe(
        this.create({
          value,
          forwardTransaction: trx,
        }),
        TE.map(result => ({
          ...result,
          created: true,
        })),
      )),
    ));
  };

  findWithRelationsByIds = ({ forwardTransaction, ids }: TransactionalAttrs<{ ids: TableId[]; }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom('users')
            .where('users.id', 'in', ids)
            .leftJoin('organizations_users', 'organizations_users.user_id', 'users.id')
            .leftJoin('organizations', 'organizations.id', 'organization_id')
            .leftJoin('auth_passwords', 'auth_passwords.user_id', 'users.id')
            .leftJoin('auth_emails', 'auth_emails.user_id', 'users.id')
            .selectAll('users')
            .select([
              'organizations_users.role as organization_role',
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'auth_passwords.id as auth_password_id',
              'auth_emails.id as auth_email_id',
            ])
            .limit(ids.length)
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          organization_id: orgId,
          organization_name: orgName,
          organization_role: orgRole,
          auth_password_id: authPasswordId,
          auth_email_id: authEmailId,
          ...user
        }): UserTableRowWithRelations => ({
          ...camelcaseKeys(user),
          auth: {
            password: {
              enabled: !isNil(authPasswordId),
            },
            email: {
              enabled: !isNil(authEmailId),
            },
          },
          organization: isNil(orgId)
            ? null
            : {
                id: orgId,
                name: orgName!,
                role: orgRole!,
              },
        })),
      ),
    );
  };

  findWithRelationsById = ({ forwardTransaction, id }: TransactionalAttrs<{ id: TableId; }>) => pipe(
    this.findWithRelationsByIds({
      forwardTransaction,
      ids: [id],
    }),
    tryGetFirstOrNotExists,
  );

  findByRefreshToken = ({
    refreshToken,
    forwardTransaction,
  }: TransactionalAttrs<{
    refreshToken: string;
  }>) => {
    return pipe(
      async (qb: KyselyQueryCreator) => {
        const userRow = await qb
          .selectFrom('users')
          .where('jwt_refresh_token', '=', refreshToken)
          .where('active', '=', true)
          .select(['id', 'email'])
          .limit(1)
          .executeTakeFirstOrThrow();

        return userRow;
      },
      tryReuseTransactionOrSkip({ db: this.db, forwardTransaction }),
      DatabaseError.tryTask,
    );
  };
}
