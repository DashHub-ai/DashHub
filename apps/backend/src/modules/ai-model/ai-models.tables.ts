import type { ColumnType } from 'kysely';

import type { SdkAICredentialsT, SdkAIProviderT } from '@llm/sdk';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type AIModelsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    organization_id: ColumnType<TableId, TableId, never>;
    name: string;
    description: string | null;
    provider: SdkAIProviderT;
    credentials: SdkAICredentialsT;
  };

export type AIModelTableRow = NormalizeSelectTableRow<AIModelsTable>;

export type AIModelTableRowWithRelations = Omit<AIModelTableRow, 'organizationId'> & {
  organization: TableRowWithIdName;
};
