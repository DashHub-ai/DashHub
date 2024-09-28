import type {
  NormalizeSelectTableRow,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type OrganizationsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    name: string;
    max_number_of_users: number;
  };

export type OrganizationTableRow = NormalizeSelectTableRow<OrganizationsTable>;
