import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
  TableUuid,
  TableWithAccessTimeColumns,
} from '../database';

export type UsersFavoritesTable = TableWithAccessTimeColumns & {
  user_id: ColumnType<TableId, TableId, never>;
  chat_id: ColumnType<TableUuid | null, TableUuid | null, never>;
  app_id: ColumnType<TableId | null, TableId | null, never>;
};

export type UserFavoriteTableRow = NormalizeSelectTableRow<UsersFavoritesTable>;

export type UserFavoriteTableInsertRow = NormalizeInsertTableRow<UsersFavoritesTable>;
