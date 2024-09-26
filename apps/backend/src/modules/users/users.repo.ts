import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/function';
import { inject, injectable } from 'tsyringe';

import type {
  SdkCreateUserT,
  SdkEnabledUserAuthMethodsT,
  SdkOrganizationUserRoleT,
} from '@llm/sdk';

import { catchTaskEitherTagError, isNil } from '@llm/commons';
import {
  createDatabaseRepo,
  DatabaseConnectionRepo,
  DatabaseError,
  type KyselyQueryCreator,
  type NormalizeSelectTableRow,
  type TableId,
  type TableRowWithIdName,
  type TransactionalAttrs,
  tryGetFirstOrNotExists,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { UsersTable } from './users.tables';

import { AuthRepo } from '../auth/repo/auth.repo';

@injectable()
export class UsersRepo extends createDatabaseRepo('users') {
  constructor(
    @inject(DatabaseConnectionRepo) databaseConnectionRepo: DatabaseConnectionRepo,
    @inject(AuthRepo) private readonly authRepo: AuthRepo,
  ) {
    super(databaseConnectionRepo);
  }

  createUser = ({ forwardTransaction, ...user }: TransactionalAttrs<SdkCreateUserT>) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.create({
        forwardTransaction: trx,
        value: {
          email: user.email,
          active: user.active,
          role: user.role,
        },
      }),
      TE.tap(({ id }) => pipe(
        this.authRepo.upsertUserAuthMethods({
          forwardTransaction: trx,
          user: { id },
          email: user.auth.email,
          password: user.auth.password,
        }),
      )),
    ));
  };

  createUserIfNotExists = ({ forwardTransaction, ...user }: TransactionalAttrs<SdkCreateUserT>) => pipe(
    this.findOne({
      forwardTransaction,
      select: ['id'],
      where: [
        ['email', '=', user.email],
      ],
    }),
    TE.map(result => ({
      ...result,
      created: false,
    })),
    catchTaskEitherTagError('DatabaseRecordNotExists')(() => pipe(
      this.createUser(user),
      TE.map(result => ({
        ...result,
        created: true,
      })),
    )),
  );

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

export type UserTableRowOrganizationRelation = TableRowWithIdName & {
  role: SdkOrganizationUserRoleT;
};

export type UserTableRowWithRelations = NormalizeSelectTableRow<UsersTable> & {
  organization: UserTableRowOrganizationRelation | null;
  auth: SdkEnabledUserAuthMethodsT;
};
