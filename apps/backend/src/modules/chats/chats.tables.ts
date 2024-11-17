import type { ColumnType } from 'kysely';

import type { SdkOffsetPaginationOutputT } from '@llm/sdk';
import type {
  NormalizeSelectTableRow,
  TableId,
  TableUuid,
  TableWithAccessTimeColumns,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
  TableWithUuidColumn,
} from '~/modules/database';

import type { MessageTableRowWithRelations } from './messages';

export type ChatsTable =
  & TableWithUuidColumn
  & TableWithAccessTimeColumns
  & TableWithArchivedAtColumn
  & {
    creator_user_id: ColumnType<TableId, TableId, never>;
    organization_id: ColumnType<TableId, TableId, never>;
    public: boolean;
  };

export type ChatSummariesTable = TableWithDefaultColumns & {
  chat_id: ColumnType<TableUuid, TableUuid, never>;
  name: string;
  name_generated: boolean;
  content: string;
  content_generated: boolean;
};

export type ChatTableRow = NormalizeSelectTableRow<ChatsTable>;
export type ChatSummaryTableRow = NormalizeSelectTableRow<ChatSummariesTable>;

export type ChatTableRowWithRelations = ChatTableRow & {
  summary: ChatSummaryTableRow | null;
  recentMessages: SdkOffsetPaginationOutputT<MessageTableRowWithRelations>;
};
