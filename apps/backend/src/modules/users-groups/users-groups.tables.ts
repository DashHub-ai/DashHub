import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';
import type { UserTableRowBaseRelation } from '../users/users.tables';

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

export type UsersGroupTableRow = NormalizeSelectTableRow<UsersGroupsTable>;

export type UsersGroupTableRowWithRelations =
  & Omit<UsersGroupTableRow, 'creatorUserId' | 'organizationId'>
  & {
    creator: UserTableRowBaseRelation;
    organization: TableRowWithIdName;
    users: UserTableRowBaseRelation[];
  };
