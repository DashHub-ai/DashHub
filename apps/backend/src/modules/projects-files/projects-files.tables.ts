import type { ColumnType } from 'kysely';

import type { NormalizeSelectTableRow, TableId } from '../database';

export type ProjectsFilesTable = {
  project_id: ColumnType<TableId, TableId, never>;
  s3_resource_id: ColumnType<TableId, TableId, never>;
};

export type ProjectsFilesTableRow = NormalizeSelectTableRow<ProjectsFilesTable>;
