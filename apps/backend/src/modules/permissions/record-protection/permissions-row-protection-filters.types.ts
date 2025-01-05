import type { SdkPermissionAccessLevelT, SdkTableRowIdT } from '@llm/sdk';

export type UserAccessPermissionsDescriptor = {
  accessLevel: SdkPermissionAccessLevelT;
  userId: SdkTableRowIdT;
  groupsIds: SdkTableRowIdT[];
};

export type WithPermissionsInternalFilters<O = unknown> = O & {
  satisfyPermissions?: UserAccessPermissionsDescriptor;
};

export type WithEnforcedPermissionsInternalFilters<O = unknown> = O & {
  satisfyPermissions: UserAccessPermissionsDescriptor;
};
