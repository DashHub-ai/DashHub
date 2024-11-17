import type { ColumnType } from 'kysely';

import type { SdkMessageRoleT } from '@llm/sdk';
import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithUuid,
  TableUuid,
  TableWithAccessTimeColumns,
  TableWithUuidColumn,
} from '~/modules/database';

export type MessagesTable =
  & TableWithUuidColumn
  & TableWithAccessTimeColumns
  & {
    chat_id: ColumnType<TableUuid, TableUuid, never>;
    creator_user_id: ColumnType<TableId | null, TableId | null, never>;
    content: string;
    role: SdkMessageRoleT;
    metadata: Record<string, unknown>;
    original_message_id: ColumnType<TableId, TableId, null>;
    repeat_count: ColumnType<number, number, never>;
  };

export type MessageTableRow = NormalizeSelectTableRow<MessagesTable>;

export type MessageTableRowWithRelations =
  & OmitRepeatFields<Omit<MessageTableRow, 'chatId'>>
  & {
    repeats: Array<Omit<MessageTableRow, 'chatId'>>;
    chat: TableRowWithUuid;
  };

type OmitRepeatFields<T> = Omit<T, 'originalMessageId' | 'repeatCount'>;
