import type { ColumnType } from 'kysely';

import type { SdkSearchEngineCredentialsT, SdkSearchEngineProviderT } from '@llm/sdk';

import type {
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';

export type SearchEnginesTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    organization_id: ColumnType<TableId, TableId, never>;
    name: string;
    description: string | null;
    provider: SdkSearchEngineProviderT;
    credentials: SdkSearchEngineCredentialsT;
    default: boolean;
  };

export type SearchEngineTableRow = NormalizeSelectTableRow<SearchEnginesTable>;

export type SearchEngineTableRowWithRelations = Omit<SearchEngineTableRow, 'organizationId'> & {
  organization: TableRowWithIdName;
};
