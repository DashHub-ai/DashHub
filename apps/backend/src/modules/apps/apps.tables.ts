import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
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
    project_id: TableId | null;
    ai_model_id: TableId | null;
  };

export type AppTableRow = NormalizeSelectTableRow<AppsTable>;

export type AppTableInsertRow = NormalizeInsertTableRow<AppsTable>;

export type AppTableRowWithRelations =
  & Omit<AppTableRow, 'organizationId' | 'categoryId' | 'logoS3ResourceId' | 'projectId' | 'aiModelId'>
  & PermissionsTableRowRelation
  & {
    organization: TableRowWithIdName;
    category: TableRowWithIdName;
    project: TableRowWithIdName;
    logo: S3ResourcesTableRowWithRelations | null;
    aiModel: TableRowWithIdName | null;
  };
