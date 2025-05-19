import type { SdkPermissionT } from '@dashhub/sdk';

export type PermissionsTableRowRelation = {
  permissions: {
    inherited: SdkPermissionT[];
    current: SdkPermissionT[];
  };
};
