import type { ColumnType } from 'kysely';

import type { SdkPermissionAccessLevelT } from '@dashhub/sdk';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
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
    ai_external_api_id: ColumnType<TableId | null, TableId | null, never>;
  };

export type PermissionInsertTableRow = NormalizeInsertTableRow<PermissionsTable>;

export type PermissionTableRow = NormalizeSelectTableRow<PermissionsTable>;

export type PermissionGroupRelationTableRow =
  & TableRowWithIdName
  & {
    users: UserTableRowBaseRelation[];
  };
