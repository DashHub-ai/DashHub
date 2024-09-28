import type { TableWithArchivedAtColumn, TableWithDefaultColumns } from '../database';

export type OrganizationsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    name: string;
    max_number_of_users: number;
  };
