import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { sql } from 'kysely';
import { inject, injectable } from 'tsyringe';

import type { SdkCreateUserInputT, SdkTableRowWithIdT, SdkUpdateUserInputT } from '@llm/sdk';

import { catchTaskEitherTagError, DistributiveOverwrite, isNil, panicError } from '@llm/commons';
import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseConnectionRepo,
  DatabaseError,
  type KyselyQueryCreator,
  RecordsArchiveAttrs,
  type TableId,
  TableRowWithId,
  type TransactionalAttrs,
  tryGetFirstOrNotExists,
  tryReuseOrCreateTransaction,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { UserTableRowWithRelations } from './users.tables';

import { AuthRepo } from '../auth/repo/auth.repo';
import { OrganizationsUsersRepo } from '../organizations/users/organizations-users.repo';
import { UsersAISettingsRepo } from '../users-ai-settings';

@injectable()
export class UsersRepo extends createProtectedDatabaseRepo('users') {
  constructor(
    @inject(DatabaseConnectionRepo) databaseConnectionRepo: DatabaseConnectionRepo,
    @inject(AuthRepo) private readonly authRepo: AuthRepo,
    @inject(UsersAISettingsRepo) private readonly usersAISettingsRepo: UsersAISettingsRepo,
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

  archiveRecords = (attrs: Omit<RecordsArchiveAttrs<'users'>, 'relatedRowValues'>) =>
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

  update = ({ forwardTransaction, id, value }: TransactionalAttrs<{
    id: TableId;
    value: DistributiveOverwrite<SdkUpdateUserInputT, {
      avatar?: TableRowWithId | null;
    }>;
  }>) => {
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
          name: value.name,
          active: value.active,
          archiveProtection: value.archiveProtection,
          avatarS3ResourceId: value.avatar?.id ?? null,
        },
      }),
      TE.tap(() => this.usersAISettingsRepo.upsert({
        forwardTransaction: trx,
        value: {
          userId: id,
          chatContext: value.aiSettings.chatContext,
        },
      })),
      TE.tap(({ id }) => pipe(
        this.authRepo.upsertUserAuthMethods({
          forwardTransaction: trx,
          user: { id },
          ...value.auth,
        }),
      )),
      TE.tap(({ id }) => {
        if (value.role !== 'user') {
          return TE.of(undefined);
        }

        return this.organizationsUsersRepo.updateUserOrganizationRole({
          forwardTransaction: trx,
          value: {
            userId: id,
            role: value.organization.role,
          },
        });
      }),
    ));
  };

  create = ({ forwardTransaction, value }: TransactionalAttrs<{
    value: DistributiveOverwrite<SdkCreateUserInputT, {
      avatar?: TableRowWithId | null;
    }>;
  }>) => {
    const transaction = tryReuseOrCreateTransaction({
      db: this.db,
      forwardTransaction,
    });

    return transaction(trx => pipe(
      this.baseRepo.create({
        forwardTransaction: trx,
        value: {
          email: value.email,
          name: value.name,
          active: value.active,
          role: value.role,
          archiveProtection: value.archiveProtection,
          avatarS3ResourceId: value.avatar?.id ?? null,
        },
      }),
      TE.tap(({ id }) => this.usersAISettingsRepo.upsert({
        forwardTransaction: trx,
        value: {
          userId: id,
          chatContext: value.aiSettings.chatContext,
        },
      })),
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

  createIfNotExists = ({ forwardTransaction, value }: TransactionalAttrs<{
    value: DistributiveOverwrite<SdkCreateUserInputT, {
      avatar?: TableRowWithId | null;
    }>;
  }>) => {
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

            .leftJoin('s3_resources', 's3_resources.id', 'users.avatar_s3_resource_id')
            .leftJoin('s3_resources_buckets', 's3_resources_buckets.id', 's3_resources.bucket_id')

            .leftJoin('users_ai_settings', 'users_ai_settings.user_id', 'users.id')

            .selectAll('users')
            .select([
              'organizations_users.role as organization_role',
              'organizations.id as organization_id',
              'organizations.name as organization_name',

              'auth_passwords.id as auth_password_id',
              'auth_emails.id as auth_email_id',

              // Avatar
              's3_resources.id as avatar_s3_resource_id',
              's3_resources.name as avatar_s3_resource_name',
              's3_resources.created_at as avatar_s3_resource_created_at',
              's3_resources.updated_at as avatar_s3_resource_updated_at',
              's3_resources.type as avatar_s3_resource_type',
              's3_resources.s3_key as avatar_s3_resource_s3_key',
              eb => sql<string>`${eb.ref('s3_resources_buckets.public_base_url')} || '/' || ${eb.ref('s3_resources.s3_key')}`.as('avatar_s3_resource_public_url'),

              // Logo bucket
              's3_resources_buckets.id as avatar_s3_resource_bucket_id',
              's3_resources_buckets.name as avatar_s3_resource_bucket_name',

              // AI settings
              'users_ai_settings.chat_context as ai_settings_chat_context',
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

          avatar_s3_resource_id: avatarId,
          avatar_s3_resource_name: avatarName,
          avatar_s3_resource_created_at: avatarCreatedAt,
          avatar_s3_resource_updated_at: avatarUpdatedAt,
          avatar_s3_resource_type: avatarType,
          avatar_s3_resource_s3_key: avatarS3Key,
          avatar_s3_resource_public_url: avatarPublicUrl,

          avatar_s3_resource_bucket_id: avatarBucketId,
          avatar_s3_resource_bucket_name: avatarBucketName,

          ai_settings_chat_context: aiSettingsChatContext,

          ...user
        }): UserTableRowWithRelations => {
          const baseFields = {
            ...camelcaseKeys(user),
            aiSettings: {
              chatContext: aiSettingsChatContext,
            },
            auth: {
              password: {
                enabled: !isNil(authPasswordId),
              },
              email: {
                enabled: !isNil(authEmailId),
              },
            },
            avatar: avatarId
              ? {
                  id: avatarId,
                  name: avatarName!,
                  createdAt: avatarCreatedAt!,
                  updatedAt: avatarUpdatedAt!,
                  type: avatarType!,
                  s3Key: avatarS3Key!,
                  publicUrl: avatarPublicUrl!,
                  bucket: {
                    id: avatarBucketId!,
                    name: avatarBucketName!,
                  },
                }
              : null,
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
