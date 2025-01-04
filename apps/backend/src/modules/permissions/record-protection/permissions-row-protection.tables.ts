import type { SdkPermissionAccessLevelT } from '@llm/sdk';

import type { TableId } from '../../database';

export type PermissionTableRowEntry = {
  id: TableId;
  groupId: TableId | null;
  userId: TableId | null;
  accessLevel: SdkPermissionAccessLevelT;
};

export type PermissionsTableRowRelation = {
  permissions: PermissionTableRowEntry[];
};
