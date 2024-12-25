import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type ProjectsTable =
  & TableWithDefaultColumns
  & TableWithArchivedAtColumn
  & {
    organization_id: ColumnType<TableId, TableId, never>;
    name: string;
    description: string | null;
    internal: boolean;
  };

export type ProjectTableRow = NormalizeSelectTableRow<ProjectsTable>;

export type ProjectTableRowWithRelations = Omit<ProjectTableRow, 'organizationId'> & {
  organization: TableRowWithIdName;
};
