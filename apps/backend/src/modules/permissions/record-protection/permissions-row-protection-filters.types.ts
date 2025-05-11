import type { SdkUserAccessPermissionsDescriptor } from '@dashhub/sdk';

export type WithPermissionsInternalFilters<O = unknown> = O & {
  satisfyPermissions?: SdkUserAccessPermissionsDescriptor;
};

export type WithEnforcedPermissionsInternalFilters<O = unknown> = O & {
  satisfyPermissions: SdkUserAccessPermissionsDescriptor;
};
