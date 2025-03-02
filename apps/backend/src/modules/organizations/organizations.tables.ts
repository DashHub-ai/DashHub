import type {
  NormalizeSelectTableRow,
  TableWithArchivedAtColumn,
  TableWithDefaultColumns,
} from '../database';
import type { OrganizationsAISettingsTableRelationRow } from '../organizations-ai-settings';

export type OrganizationsTable = TableWithDefaultColumns &
  TableWithArchivedAtColumn & {
    name: string;
    max_number_of_users: number;
  };

export type OrganizationTableRow = NormalizeSelectTableRow<OrganizationsTable>;

export type OrganizationTableRowWithRelations = OrganizationTableRow & {
  aiSettings: OrganizationsAISettingsTableRelationRow;
};
