import type { ColumnType } from 'kysely';

import type {
  AIGeneratedColumns,
  NormalizeSelectTableRow,
  TableId,
  TableUuid,
  TableWithDefaultColumns,
} from '~/modules/database';

export type ProjectsSummariesTable =
  & TableWithDefaultColumns
  & AIGeneratedColumns<'content'>
  & {
    project_id: ColumnType<TableId, TableId, never>;
    last_summarized_message_id: TableUuid | null;
  };

export type ProjectSummaryTableRow = NormalizeSelectTableRow<ProjectsSummariesTable>;
