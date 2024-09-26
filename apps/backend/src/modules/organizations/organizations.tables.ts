import type { TableWithArchivedAtColumn, TableWithDefaultColumns } from '../database';

export type OrganizationsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    name: string;
    maxNumberOfUsers: number;
  };
