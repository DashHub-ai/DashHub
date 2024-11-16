import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type ChatsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    organization_id: ColumnType<TableId, TableId, never>;
    last_message_at: Date | null;
  };

export type ChatSummariesTable = TableWithDefaultColumns & {
  chat_id: ColumnType<TableId, TableId, never>;
  content: string;
};

export type ChatTableRow = NormalizeSelectTableRow<ChatsTable>;
export type ChatSummaryTableRow = NormalizeSelectTableRow<ChatSummariesTable>;

export type ChatWithRelations = ChatTableRow & {
  summary?: ChatSummaryTableRow;
};
