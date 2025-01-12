import type { SdkUserAccessPermissionsDescriptor } from '@llm/sdk';

export type WithPermissionsInternalFilters<O = unknown> = O & {
  satisfyPermissions?: SdkUserAccessPermissionsDescriptor;
};

export type WithEnforcedPermissionsInternalFilters<O = unknown> = O & {
  satisfyPermissions: SdkUserAccessPermissionsDescriptor;
};
