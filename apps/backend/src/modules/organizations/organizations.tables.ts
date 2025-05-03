import type {
  NormalizeSelectTableRow,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';
import type { OrganizationsAISettingsTableRelationRow } from '../organizations-ai-settings';

export type OrganizationsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    name: string;
  };

export type OrganizationTableRow = NormalizeSelectTableRow<OrganizationsTable>;

export type OrganizationTableRowWithRelations = OrganizationTableRow & {
  aiSettings: OrganizationsAISettingsTableRelationRow;
};
