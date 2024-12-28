import type { ColumnType } from 'kysely';

import type {
  TableId,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type UsersGroupsTable =
  & TableWithDefaultColumns
  & TableWithArchivedAtColumn
  & {
    name: string;
    creator_user_id: ColumnType<TableId, TableId, never>;
    organization_id: ColumnType<TableId, TableId, never>;
  };

export type UsersGroupsUsersTable = {
  user_id: ColumnType<TableId, TableId, never>;
  group_id: ColumnType<TableId, TableId, never>;
};
