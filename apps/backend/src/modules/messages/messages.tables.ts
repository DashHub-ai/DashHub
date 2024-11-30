import type { ColumnType } from 'kysely';

import type { SdkMessageRoleT } from '@llm/sdk';
import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableRowWithUuid,
  TableUuid,
  TableWithAccessTimeColumns,
  TableWithUuidColumn,
} from '~/modules/database';

import type { UserTableRowBaseRelation } from '../users';

export type MessagesTable =
  & TableWithUuidColumn
  & TableWithAccessTimeColumns
  & {
    chat_id: ColumnType<TableUuid, TableUuid, never>;
    creator_user_id: ColumnType<TableId | null, TableId | null, never>;
    content: string;
    role: SdkMessageRoleT;
    metadata: Record<string, unknown>;
    ai_model_id: ColumnType<TableId | null, TableId | null, never>;
    replied_message_id: ColumnType<TableUuid | null, TableUuid | null, null>;
  };

export type MessageTableRow = NormalizeSelectTableRow<MessagesTable>;

type RepliedMessageTableRelationRow =
  & Pick<MessageTableRow, 'id' | 'role' | 'content'>
  & {
    creator: UserTableRowBaseRelation | null;
  };

export type MessageTableRowWithRelations =
  & Omit<MessageTableRow, 'chatId' | 'creatorUserId' | 'aiModelId' | 'repliedMessageId'>
  & {
    chat: TableRowWithUuid;
    repliedMessage: RepliedMessageTableRelationRow | null;
    creator: UserTableRowBaseRelation | null;
    aiModel: TableRowWithIdName | null;
  };
