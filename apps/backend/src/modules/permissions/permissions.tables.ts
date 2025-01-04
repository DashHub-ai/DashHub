import type { ColumnType } from 'kysely';

import type { SdkPermissionAccessLevelT } from '@llm/sdk';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithId,
  TableRowWithIdName,
  TableRowWithUuid,
  TableUuid,
  TableWithDefaultColumns,
} from '../database';
import type { UserTableRowBaseRelation } from '../users';

export type PermissionsTable =
  & TableWithDefaultColumns
  & {
    user_id: ColumnType<TableId | null, TableId | null, never>;
    group_id: ColumnType<TableId | null, TableId | null, never>;
    access_level: SdkPermissionAccessLevelT;

    // Resource types
    project_id: ColumnType<TableId | null, TableId | null, never>;
    app_id: ColumnType<TableId | null, TableId | null, never>;
    chat_id: ColumnType<TableUuid | null, TableUuid | null, never>;
  };

export type PermissionInsertTableRow = NormalizeInsertTableRow<PermissionsTable>;

export type PermissionTableRow = NormalizeSelectTableRow<PermissionsTable>;

export type PermissionGroupRelationTableRow =
  & TableRowWithIdName
  & {
    users: UserTableRowBaseRelation[];
  };

export type PermissionTableRowWithRelations =
  & Omit<PermissionTableRow, 'projectId' | 'chatId' | 'appId' | 'userId' | 'groupId'>
  & {
    project: TableRowWithId | null;
    app: TableRowWithId | null;
    chat: TableRowWithUuid | null;
  }
  & (
    {
      user: null;
      group: PermissionGroupRelationTableRow;
    }
    | {
      user: UserTableRowBaseRelation;
      group: null;
    }
  );
