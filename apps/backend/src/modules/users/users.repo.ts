import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateUserInputT, SdkTableRowWithIdT, SdkUpdateUserInputT } from '@llm/sdk';

import { catchTaskEitherTagError, isNil, panicError } from '@llm/commons';
import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseConnectionRepo,
  DatabaseError,
  type KyselyQueryCreator,
  RecordsArchiveBasicAttrs,
  type TableId,
  type TransactionalAttrs,
  tryGetFirstOrNotExists,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { UserTableRowWithRelations } from './users.tables';

import { AuthRepo } from '../auth/repo/auth.repo';
import { OrganizationsUsersRepo } from '../organizations/users/organizations-users.repo';

@injectable()
export class UsersRepo extends createProtectedDatabaseRepo('users') {
  constructor(
    @inject(DatabaseConnectionRepo) databaseConnectionRepo: DatabaseConnectionRepo,
    @inject(AuthRepo) private readonly authRepo: AuthRepo,
    @inject(OrganizationsUsersRepo) private readonly organizationsUsersRepo: OrganizationsUsersRepo,
  ) {
    super(databaseConnectionRepo);
  }

  archive = (attrs: TransactionalAttrs<SdkTableRowWithIdT>) =>
    createArchiveRecordQuery(this.baseRepo.queryFactoryAttrs)({
      ...attrs,
      relatedRowValues: {
        active: false,
      },
    });

  archiveRecords = (attrs: RecordsArchiveBasicAttrs<'users'>) =>
    createArchiveRecordsQuery(this.baseRepo.queryFactoryAttrs)({
      ...attrs,
      relatedRowValues: {
        active: false,
      },
    });

  unarchive = createUnarchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

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

  update = ({ forwardTransaction, id, value }: TransactionalAttrs<{ id: TableId; value: SdkUpdateUserInputT; }>) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.baseRepo.update({
        forwardTransaction: trx,
        id,
        value: {
          email: value.email,
          active: value.active,
          archiveProtection: value.archiveProtection,
        },
      }),
      TE.tap(({ id }) => pipe(
        this.authRepo.upsertUserAuthMethods({
          forwardTransaction: trx,
          user: { id },
          ...value.auth,
        }),
      )),
    ));
  };

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
          archiveProtection: value.archiveProtection,
        },
      }),
      TE.tap(({ id }) => pipe(
        this.authRepo.upsertUserAuthMethods({
          forwardTransaction: trx,
          user: { id },
          ...value.auth,
        }),
      )),
      TE.tap(({ id }) => {
        if (value.role === 'user') {
          return this.organizationsUsersRepo.create({
            forwardTransaction: trx,
            value: {
              userId: id,
              organizationId: value.organization.item.id,
              role: value.organization.role,
            },
          });
        }

        return TE.right(undefined);
      }),
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
            .selectFrom(this.table)
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
        }): UserTableRowWithRelations => {
          const baseFields = {
            ...camelcaseKeys(user),
            auth: {
              password: {
                enabled: !isNil(authPasswordId),
              },
              email: {
                enabled: !isNil(authEmailId),
              },
            },
          };

          switch (baseFields.role) {
            case 'root':
              return {
                ...baseFields,
                role: 'root',
                organization: null,
              };

            case 'user':
              return {
                ...baseFields,
                role: 'user',
                organization: {
                  id: orgId!,
                  name: orgName!,
                  role: orgRole!,
                },
              };

            default: {
              const unknownUser: never = baseFields.role;

              throw panicError(`Unknown user role: ${unknownUser} (ID: ${baseFields.id})!`)(baseFields);
            }
          }
        }),
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
