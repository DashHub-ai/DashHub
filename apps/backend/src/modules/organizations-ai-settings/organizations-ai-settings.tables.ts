import type { ColumnType } from 'kysely';

import type {
  NormalizeInsertTableRow,
  NormalizeSelectTableRow,
  TableId,
  TableRowWithIdName,
} from '../database';

export type OrganizationsAISettingsTable = {
  organization_id: ColumnType<TableId, TableId, never>;
  project_id: ColumnType<TableId, TableId, never>;
  chat_context: string | null;
};

export type OrganizationsAISettingsTableRow = NormalizeSelectTableRow<OrganizationsAISettingsTable>;

export type OrganizationsAISettingsTableInsertRow = NormalizeInsertTableRow<OrganizationsAISettingsTable>;

export type OrganizationsAISettingsTableRelationRow =
  & Omit<OrganizationsAISettingsTableRow, 'organizationId' | 'projectId'>
  & {
    project: TableRowWithIdName;
  };
