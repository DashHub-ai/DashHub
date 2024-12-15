import type { ColumnType } from 'kysely';

import type { NormalizeInsertTableRow, NormalizeSelectTableRow, TableId } from '../database';

export type ProjectsFilesTable = {
  project_id: ColumnType<TableId, TableId, never>;
  s3_resource_id: ColumnType<TableId, TableId, never>;
};

export type ProjectsFilesTableRow = NormalizeSelectTableRow<ProjectsFilesTable>;

export type ProjectsFilesTableInsertRow = NormalizeInsertTableRow<ProjectsFilesTable>;
