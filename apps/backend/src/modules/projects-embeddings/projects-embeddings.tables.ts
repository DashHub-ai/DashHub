import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithId,
  TableRowWithIdName,
  TableWithDefaultColumns,
} from '../database';
import type { S3ResourcesTableRowWithRelations } from '../s3';

export type ProjectsEmbeddingsTable =
  & TableWithDefaultColumns
  & {
    project_file_id: ColumnType<TableId, TableId, never>;
    ai_model_id: ColumnType<TableId, TableId, never>;
    text: ColumnType<string, string, never>;
    vector: ColumnType<string, string, never>;
    summary: ColumnType<boolean, boolean, never>;
    metadata: Record<string, unknown>;
  };

export type ProjectEmbeddingsTableRow = NormalizeSelectTableRow<ProjectsEmbeddingsTable>;

export type ProjectEmbeddingsInsertTableRow = NormalizeInsertTableRow<ProjectsEmbeddingsTable>;

export type ProjectEmbeddingsTableRowWithRelations =
  & Omit<ProjectEmbeddingsTableRow, 'projectFileId'>
  & {
    project: TableRowWithId;
    projectFile: TableRowWithIdName & {
      resource: Pick<S3ResourcesTableRowWithRelations, 'id' | 'publicUrl'>;
    };
  };
