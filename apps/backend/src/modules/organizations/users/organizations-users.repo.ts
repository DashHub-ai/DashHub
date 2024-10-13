import { flow, pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import { mapAsyncIterator, pluck } from '@llm/commons';
import { createDatabaseRepo, TableId } from '~/modules/database';

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

  createOrganizationUsersIdsIterator = flow(
    this.createOrganizationUsersIterator,
    mapAsyncIterator(pluck('id')),
  );
}
