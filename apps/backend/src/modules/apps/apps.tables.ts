import type { ColumnType } from 'kysely';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';
import type { PermissionsTableRowRelation } from '../permissions';
import type { S3ResourcesTableRowWithRelations } from '../s3';

export type AppsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    organization_id: ColumnType<TableId, TableId, never>;
    name: string;
    chat_context: string;
    description: string | null;
    category_id: TableId;
    logo_s3_resource_id: TableId | null;
  };

export type AppTableRow = NormalizeSelectTableRow<AppsTable>;

export type AppTableRowWithRelations =
  & Omit<AppTableRow, 'organizationId' | 'categoryId' | 'logoS3ResourceId'>
  & PermissionsTableRowRelation
  & {
    organization: TableRowWithIdName;
    category: TableRowWithIdName;
    logo: S3ResourcesTableRowWithRelations | null;
  };
