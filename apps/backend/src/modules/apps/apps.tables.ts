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
    description: string | null;
    category_id: TableId;
  };

export type AppTableRow = NormalizeSelectTableRow<AppsTable>;

export type AppTableRowWithRelations = Omit<AppTableRow, 'organizationId' | 'categoryId'> & {
  organization: TableRowWithIdName;
  category: TableRowWithIdName;
};
