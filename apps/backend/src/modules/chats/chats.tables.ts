import type { ColumnType } from 'kysely';

import type {
  DropTableRowAccessTime,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithAccessTimeColumns,
  TableWithArchivedAtColumn,
  TableWithUuidColumn,
} from '~/modules/database';

import type { ChatSummaryTableRow } from '../chats-summaries';
import type { UserTableRowBaseRelation } from '../users';

export type ChatsTable =
  & TableWithUuidColumn
  & TableWithAccessTimeColumns
  & TableWithArchivedAtColumn
  & {
    creator_user_id: ColumnType<TableId, TableId, never>;
    organization_id: ColumnType<TableId, TableId, never>;
    project_id: TableId | null;
    internal: boolean;
  };

export type ChatTableRow = NormalizeSelectTableRow<ChatsTable>;

type ChatSummaryTableRowRelation = DropTableRowAccessTime<
  Omit<ChatSummaryTableRow, 'chatId' | 'lastSummarizedMessageId'>
>;

type ChatProjectTableRowRelation = TableRowWithIdName & {
  internal: boolean;
};

export type ChatTableRowWithRelations =
  & Omit<ChatTableRow, 'organizationId' | 'creatorUserId' | 'projectId'>
  & {
    summary: ChatSummaryTableRowRelation;
    organization: TableRowWithIdName;
    project: ChatProjectTableRowRelation | null;
    creator: UserTableRowBaseRelation;
  };
