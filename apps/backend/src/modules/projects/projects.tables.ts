import type { ColumnType } from 'kysely';

import type {
  DropTableRowAccessTime,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';
import type { ProjectSummaryTableRow } from '../projects-summaries';

export type ProjectsTable =
  & TableWithDefaultColumns
  & TableWithArchivedAtColumn
  & {
    organization_id: ColumnType<TableId, TableId, never>;
    creator_user_id: ColumnType<TableId, TableId, never>;
    name: string;
    internal: boolean;
  };

export type ProjectTableRow = NormalizeSelectTableRow<ProjectsTable>;

type ProjectSummaryTableRowRelation = DropTableRowAccessTime<
  Omit<ProjectSummaryTableRow, 'projectId' | 'lastSummarizedMessageId'>
>;

export type ProjectTableRowWithRelations = Omit<ProjectTableRow, 'organizationId'> & {
  organization: TableRowWithIdName;
  summary: ProjectSummaryTableRowRelation;
};
