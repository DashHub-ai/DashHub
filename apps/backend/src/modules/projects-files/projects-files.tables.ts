import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithDefaultColumns,
} from '../database';
import type { S3ResourcesTableRowWithRelations } from '../s3';

export type ProjectsFilesTable =
  & TableWithDefaultColumns
  & {
    project_id: ColumnType<TableId, TableId, never>;
    s3_resource_id: ColumnType<TableId, TableId, never>;
  };

export type ProjectFileTableRow = NormalizeSelectTableRow<ProjectsFilesTable>;

export type ProjectFileTableInsertRow = NormalizeInsertTableRow<ProjectsFilesTable>;

export type ProjectFileTableRowWithRelations =
  & Omit<ProjectFileTableRow, 'projectId' | 's3ResourceId'>
  & {
    resource: S3ResourcesTableRowWithRelations;
    project: TableRowWithIdName;
  };
