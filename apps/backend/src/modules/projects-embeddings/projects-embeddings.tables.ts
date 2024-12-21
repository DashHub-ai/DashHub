import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableWithDefaultColumns,
} from '../database';

export type ProjectsEmbeddingsTable =
  & TableWithDefaultColumns
  & {
    project_file_id: ColumnType<TableId, TableId, never>;
    text: ColumnType<string, string, never>;
    vector: ColumnType<number[], number[], never>;
    summary: ColumnType<boolean, boolean, never>;
    metadata: Record<string, unknown>;
  };

export type ProjectEmbeddingsTableRow = NormalizeSelectTableRow<ProjectsEmbeddingsTable>;
