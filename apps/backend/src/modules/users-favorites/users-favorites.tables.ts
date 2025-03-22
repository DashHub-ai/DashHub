import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
  TableUuid,
} from '../database';

export type UsersFavoritesTable = {
  user_id: ColumnType<TableId, TableId, never>;
  chat_id: ColumnType<TableUuid | null, TableUuid | null, never>;
  app_id: ColumnType<TableId | null, TableId | null, never>;
};

export type UserFavoriteTableRow = NormalizeSelectTableRow<UsersFavoritesTable>;

export type UserFavoriteTableInsertRow = NormalizeInsertTableRow<UsersFavoritesTable>;
