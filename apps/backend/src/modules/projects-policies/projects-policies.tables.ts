import type { ColumnType } from 'kysely';

import type { SdkProjectAccessLevelT } from '@llm/sdk';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithDefaultColumns,
} from '../database';
import type { UserTableRowBaseRelation } from '../users';

export type ProjectsPoliciesTable =
  & TableWithDefaultColumns
  & {
    project_id: ColumnType<TableId, TableId, never>;
    user_id: ColumnType<TableId | null, TableId | null, never>;
    group_id: ColumnType<TableId | null, TableId | null, never>;
    access_level: SdkProjectAccessLevelT;
  };

export type ProjectPolicyTableRow = NormalizeSelectTableRow<ProjectsPoliciesTable>;

export type ProjectPolicyGroupRelationTableRow =
  & TableRowWithIdName
  & {
    users: UserTableRowBaseRelation[];
  };

export type ProjectPolicyTableRowWithRelations =
  & Omit<ProjectPolicyTableRow, 'projectId' | 'userId' | 'groupId'>
  & {
    project: TableRowWithIdName;
  }
  & (
    {
      user: null;
      group: ProjectPolicyGroupRelationTableRow;
    }
    | {
      user: UserTableRowBaseRelation;
      group: null;
    }
  );
