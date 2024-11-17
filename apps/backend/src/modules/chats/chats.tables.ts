import type { ColumnType } from 'kysely';

import type { SdkOffsetPaginationOutputT } from '@llm/sdk';
import type {
  AIGeneratedColumns,
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

export type ChatSummariesTable =
  & TableWithDefaultColumns
  & AIGeneratedColumns<'name' | 'content'>
  & {
    chat_id: ColumnType<TableUuid, TableUuid, never>;
  };

export type ChatTableRow = NormalizeSelectTableRow<ChatsTable>;
export type ChatSummaryTableRow = NormalizeSelectTableRow<ChatSummariesTable>;

export type ChatTableRowWithRelations = ChatTableRow & {
  summary: ChatSummaryTableRow | null;
  recentMessages: SdkOffsetPaginationOutputT<MessageTableRowWithRelations>;
};
