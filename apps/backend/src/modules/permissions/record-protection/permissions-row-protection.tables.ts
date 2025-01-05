import type { SdkPermissionT } from '@llm/sdk';

export type PermissionsTableRowRelation = {
  permissions: {
    inherited: SdkPermissionT[];
    current: SdkPermissionT[];
  };
};
