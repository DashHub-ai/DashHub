import type { ColumnType } from 'kysely';

import type { SdkAIExternalAPISchemaT } from '@llm/sdk';

import type { TableId, TableWithArchivedAtColumn, TableWithDefaultColumns } from '../database';

export type AIExternalAPIsTable =
  & TableWithDefaultColumns
  & TableWithArchivedAtColumn
  & {
    organization_id: ColumnType<TableId, TableId, never>;
    name: string;
    description: string | null;
    schema: SdkAIExternalAPISchemaT;
  };
