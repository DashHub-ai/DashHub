import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
} from '../database';

export type UsersAISettingsTable = {
  user_id: ColumnType<TableId, TableId, never>;
  chat_context: string | null;
};

export type UsersAISettingsTableRow = NormalizeSelectTableRow<UsersAISettingsTable>;

export type UsersAISettingsTableInsertRow = NormalizeInsertTableRow<UsersAISettingsTable>;
