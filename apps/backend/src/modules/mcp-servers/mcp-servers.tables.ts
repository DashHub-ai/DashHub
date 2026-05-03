import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type MCPServersTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    organization_id: ColumnType<TableId, TableId, never>;
    name: string;
    description: string | null;
    url: string;
    enabled: boolean;
  };

export type MCPServerTableRow = NormalizeSelectTableRow<MCPServersTable>;

export type MCPServerTableRowWithRelations = Omit<MCPServerTableRow, 'organizationId'> & {
  organization: TableRowWithIdName;
};
