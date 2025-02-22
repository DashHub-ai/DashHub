import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableUuid,
  TableWithDefaultColumns,
} from '../database';
import type { MessageTableRowWithRelations } from '../messages';
import type { UserTableRowBaseRelation } from '../users';

export type PinnedMessagesTable =
  & TableWithDefaultColumns
  & {
    creator_user_id: ColumnType<TableId, TableId, never>;
    message_id: ColumnType<TableUuid, TableUuid, never>;
  };

export type PinnedMessageTableRow = NormalizeSelectTableRow<PinnedMessagesTable>;

export type PinnedMessageTableRowWithRelations =
  & Omit<PinnedMessageTableRow, 'creatorUserId' | 'messageId'>
  & {
    creator: UserTableRowBaseRelation;
    message: MessageTableRowWithRelations;
  };
