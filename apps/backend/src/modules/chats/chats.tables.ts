import type { ColumnType } from 'kysely';

import type { SdkChatStatsT } from '@llm/sdk';
import type {
  DropTableRowAccessTime,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithId,
  TableRowWithIdName,
  TableWithAccessTimeColumns,
  TableWithArchivedAtColumn,
  TableWithUuidColumn,
} from '~/modules/database';

import type { ChatSummaryTableRow } from '../chats-summaries';
import type { PermissionsTableRowRelation } from '../permissions';
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

type ChatAppTableRow = TableRowWithId & {
  aiExternalApi: TableRowWithId | null;
};

export type ChatTableRowWithRelations =
  & Omit<ChatTableRow, 'organizationId' | 'creatorUserId' | 'projectId'>
  & PermissionsTableRowRelation
  & {
    summary: ChatSummaryTableRowRelation;
    organization: TableRowWithIdName;
    apps: ChatAppTableRow[];
    project: ChatProjectTableRowRelation | null;
    creator: UserTableRowBaseRelation;
    stats: SdkChatStatsT;
  };
