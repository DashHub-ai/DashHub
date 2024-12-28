import type { ColumnType } from 'kysely';

import type { SdkProjectAccessLevelT } from '@llm/sdk';

import type { TableId, TableWithDefaultColumns } from '../database';

export type ProjectsPoliciesTable =
  & TableWithDefaultColumns
  & {
    project_id: ColumnType<TableId, TableId, never>;
    user_id: ColumnType<TableId | null, TableId | null, never>;
    group_id: ColumnType<TableId | null, TableId | null, never>;
    access_level: SdkProjectAccessLevelT;
  };
