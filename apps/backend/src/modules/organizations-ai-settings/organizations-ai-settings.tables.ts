import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
} from '../database';

export type OrganizationsAISettingsTable = {
  organization_id: ColumnType<TableId, TableId, never>;
  chat_context: string | null;
};

export type OrganizationsAISettingsTableRow = NormalizeSelectTableRow<OrganizationsAISettingsTable>;

export type OrganizationsAISettingsTableInsertRow = NormalizeInsertTableRow<OrganizationsAISettingsTable>;

export type OrganizationsAISettingsTableRelationRow = Omit<OrganizationsAISettingsTableRow, 'organizationId'>;
