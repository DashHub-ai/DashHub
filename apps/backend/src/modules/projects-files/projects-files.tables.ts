import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
} from '../database';
import type { S3ResourcesTableRowWithRelations } from '../s3';

export type ProjectsFilesTable = {
  project_id: ColumnType<TableId, TableId, never>;
  s3_resource_id: ColumnType<TableId, TableId, never>;
};

export type ProjectFileTableRow = NormalizeSelectTableRow<ProjectsFilesTable>;

export type ProjectFileTableInsertRow = NormalizeInsertTableRow<ProjectsFilesTable>;

export type ProjectFileTableRowWithRelations = S3ResourcesTableRowWithRelations & {
  project: TableRowWithIdName;
};
