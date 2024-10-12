import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type AppsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    organization_id: ColumnType<TableId, TableId, never>;
    name: string;
    chat_context: string;
  };

export type AppTableRow = NormalizeSelectTableRow<AppsTable>;

export type AppTableRowWithRelations = Omit<AppTableRow, 'organizationId'> & {
  organization: TableRowWithIdName;
};
