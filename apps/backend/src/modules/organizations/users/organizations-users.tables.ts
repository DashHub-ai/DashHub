import type { SdkOrganizationUserRoleT } from '@llm/sdk';
import type { TableId, TableWithDefaultColumns } from '~/modules/database';

export type OrganizationsUsersTable = TableWithDefaultColumns & {
  organization_id: TableId;
  user_id: TableId;
  role: SdkOrganizationUserRoleT;
};
