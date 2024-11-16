import type { ColumnType } from 'kysely';

import type { SdkMessageRoleT } from '@llm/sdk';
import type {
  NormalizeSelectTableRow,
  TableId,
  TableWithDefaultColumns,
} from '~/modules/database';

export type MessagesTable = TableWithDefaultColumns & {
  chat_id: ColumnType<TableId, TableId, never>;
  content: string;
  role: SdkMessageRoleT;
  metadata: Record<string, unknown>;
  original_message_id: ColumnType<TableId, TableId, null>;
  repeat_count: ColumnType<number, number, never>;
};

export type MessageTableRow = NormalizeSelectTableRow<MessagesTable>;

export type MessageTableRowWithRelations =
  & OmitRepeatFields<MessageTableRow>
  & {
    repeats: Array<OmitRepeatFields<MessageTableRow>>;
  };

type OmitRepeatFields<T> = Omit<T, 'originalMessageId' | 'repeatCount'>;
