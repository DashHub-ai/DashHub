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

    // Used to indicate if message is reply for another message.
    replied_message_id: ColumnType<TableUuid | null, TableUuid | null, null>;

    // Used as original message for repeated messages.
    original_message_id: ColumnType<TableUuid | null, TableUuid | null, null>;
    repeat_count: ColumnType<number, number, never>;
  };

export type MessageTableRow = NormalizeSelectTableRow<MessagesTable>;

export type MessageTableRowWithRelations =
  & OmitRepeatFields<Omit<MessageTableRow, 'chatId' | 'creatorUserId' | 'aiModelId' | 'repliedMessageId'>>
  & {
    repeats: Array<Omit<MessageTableRow, 'chatId' | 'creatorUserId' | 'aiModelId'>>;
    chat: TableRowWithUuid;
    repliedMessage: TableRowWithUuid | null;
    creator: UserTableRowBaseRelation | null;
    aiModel: TableRowWithIdName | null;
  };

type OmitRepeatFields<T> = Omit<T, 'originalMessageId' | 'repeatCount'>;
