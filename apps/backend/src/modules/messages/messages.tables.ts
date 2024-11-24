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
    original_message_id: ColumnType<TableId | null, TableId | null, null>;
    repeat_count: ColumnType<number, number, never>;
    ai_model_id: ColumnType<TableId | null, TableId | null, never>;
  };

export type MessageTableRow = NormalizeSelectTableRow<MessagesTable>;

export type MessageTableRowWithRelations =
  & OmitRepeatFields<Omit<MessageTableRow, 'chatId' | 'creatorUserId' | 'aiModelId'>>
  & {
    repeats: Array<Omit<MessageTableRow, 'chatId' | 'creatorUserId' | 'aiModelId'>>;
    chat: TableRowWithUuid;
    creator: UserTableRowBaseRelation | null;
    aiModel: TableRowWithIdName | null;
  };

type OmitRepeatFields<T> = Omit<T, 'originalMessageId' | 'repeatCount'>;
