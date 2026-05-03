import camelcaseKeys from 'camelcase-keys';
import { array as A, taskEither as TE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';
import { injectable } from 'tsyringe';

import {
  createArchiveRecordQuery,
  createArchiveRecordsQuery,
  createProtectedDatabaseRepo,
  createUnarchiveRecordQuery,
  createUnarchiveRecordsQuery,
  DatabaseError,
  TableId,
  TransactionalAttrs,
  tryReuseTransactionOrSkip,
} from '~/modules/database';

import type { MCPServerTableRowWithRelations } from './mcp-servers.tables';

@injectable()
export class MCPServersRepo extends createProtectedDatabaseRepo('mcp_servers') {
  createIdsIterator = this.baseRepo.createIdsIterator;

  archive = createArchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  archiveRecords = createArchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  unarchive = createUnarchiveRecordQuery(this.baseRepo.queryFactoryAttrs);

  unarchiveRecords = createUnarchiveRecordsQuery(this.baseRepo.queryFactoryAttrs);

  create = ({ forwardTransaction, value: { organization, ...value } }: TransactionalAttrs<{
    value: { organization: { id: TableId }; name: string; description?: string | null; url: string; enabled?: boolean };
  }>) => this.baseRepo.create({
    forwardTransaction,
    value: {
      ...value,
      organizationId: organization.id,
    },
  });

  findEnabledByOrganizationId = ({ forwardTransaction, organizationId }: TransactionalAttrs<{ organizationId: TableId }>) => {
    const transaction = tryReuseTransactionOrSkip({ db: this.db, forwardTransaction });

    return pipe(
      transaction(
        async qb =>
          qb
            .selectFrom(this.table)
            .where('mcp_servers.organization_id', '=', organizationId)
            .where('mcp_servers.enabled', '=', true)
            .where('mcp_servers.archived_at', 'is', null)
            .innerJoin('organizations', 'organizations.id', 'organization_id')
            .selectAll('mcp_servers')
            .select([
              'organizations.id as organization_id',
              'organizations.name as organization_name',
            ])
            .execute(),
      ),
      DatabaseError.tryTask,
      TE.map(
        A.map(({
          organization_id: orgId,
          organization_name: orgName,
          ...item
        }): MCPServerTableRowWithRelations => ({
          ...camelcaseKeys(item),
          organization: { id: orgId, name: orgName },
        })),
      ),
    );
  };
}
