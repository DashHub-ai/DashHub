import type { ColumnType } from 'kysely';

import type { SdkAIExternalAPISchemaT } from '@llm/sdk';

import type {
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';
import type { S3ResourcesTableRowWithRelations } from '../s3';

export type AIExternalAPIsTable =
  & TableWithDefaultColumns
  & TableWithArchivedAtColumn
  & {
    organization_id: ColumnType<TableId, TableId, never>;
    name: string;
    logo_s3_resource_id: TableId | null;
    description: string | null;
    schema: SdkAIExternalAPISchemaT;
  };

export type AIExternalAPITableRowWithRelations =
  & Omit<AIExternalAPIsTable, 'organizationId' | 'logoS3ResourceId'>
  & {
    organization: TableRowWithIdName;
    logo: S3ResourcesTableRowWithRelations | null;
  };
