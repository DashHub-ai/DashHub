import { flow, pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import type { SdkOrganizationUserRoleT } from '@dashhub/sdk';

import { mapAsyncIterator, pluck } from '@dashhub/commons';
import { createDatabaseRepo, type TableId, type TransactionalAttrs } from '~/modules/database';

type OrganizationUsersIteratorAttrs = {
  organizationId: TableId;
  chunkSize?: number;
};

@injectable()
export class OrganizationsUsersRepo extends createDatabaseRepo('organizations_users') {
  createOrganizationUsersIterator = (
    {
      organizationId,
      chunkSize = 100,
    }: OrganizationUsersIteratorAttrs,
  ) =>
    pipe(
      this.db
        .selectFrom(this.table)
        .select([
          'user_id as id',
          'role',
        ])
        .where('organization_id', '=', organizationId)
        .orderBy('id', 'asc'),
      this.queryBuilder.createChunkedIterator({
        chunkSize,
      }),
    );

  updateUserOrganizationRole = (
    {
      value,
      forwardTransaction,
    }: TransactionalAttrs<{
      value: {
        userId: TableId;
        role: SdkOrganizationUserRoleT;
      };
    }>,
  ) =>
    this.updateAll({
      forwardTransaction,
      value: {
        role: value.role,
      },
      where: [
        ['userId', '=', value.userId],
      ],
    });

  createOrganizationUsersIdsIterator = flow(
    this.createOrganizationUsersIterator,
    mapAsyncIterator(pluck('id')),
  );
}
