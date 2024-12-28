import type { ColumnType } from 'kysely';

import type { TableId, TableWithDefaultColumns } from '../database';

export type ProjectsPoliciesTable =
  & TableWithDefaultColumns
  & {
    project_id: ColumnType<TableId, TableId, never>;
    user_id: ColumnType<TableId | null, TableId | null, never>;
    group_id: ColumnType<TableId | null, TableId | null, never>;
    read: boolean;
    write: boolean;
  };
