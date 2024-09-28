import { injectable } from 'tsyringe';

import {
  createDatabaseRepo,
  type DatabaseTE,
  type NormalizeSelectTableRow,
  type TableId,
  type TransactionalAttrs,
} from '~/modules/database';

import type { OrganizationsTable } from './organizations.tables';

@injectable()
export class OrganizationsRepo extends createDatabaseRepo('organizations') {
  findWithRelationsByIds = (
    {
      forwardTransaction,
      ids,
    }: TransactionalAttrs<{ ids: TableId[]; }>,
  ): DatabaseTE<OrganizationTableRowWithRelations[]> =>
    this.findByIds({ forwardTransaction, ids });
}

export type OrganizationTableRowWithRelations = NormalizeSelectTableRow<OrganizationsTable>;
