import type { ColumnType } from 'kysely';

import type {
  AIGeneratedColumns,
  NormalizeSelectTableRow,
  TableUuid,
  TableWithDefaultColumns,
} from '~/modules/database';

export type ChatSummariesTable =
  & TableWithDefaultColumns
  & AIGeneratedColumns<'name' | 'content'>
  & {
    chat_id: ColumnType<TableUuid, TableUuid, never>;
    last_summarized_message_id: TableUuid | null;
  };

export type ChatSummaryTableRow = NormalizeSelectTableRow<ChatSummariesTable>;
