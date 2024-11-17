import type { ColumnType } from 'kysely';

import type {
  AIGeneratedColumns,
  DropTableRowAccessTime,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableUuid,
  TableWithAccessTimeColumns,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
  TableWithUuidColumn,
} from '~/modules/database';

import type { UserTableRowBaseRelation } from '../users';

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

type ChatSummaryTableRowRelation = DropTableRowAccessTime<
  Omit<ChatSummaryTableRow, 'chatId'>
>;

export type ChatTableRowWithRelations =
  & Omit<ChatTableRow, 'organizationId' | 'creatorUserId'>
  & {
    summary: ChatSummaryTableRowRelation;
    organization: TableRowWithIdName;
    creator: UserTableRowBaseRelation;
  };
