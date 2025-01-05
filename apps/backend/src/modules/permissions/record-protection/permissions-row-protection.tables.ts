import type { SdkPermissionsT } from '@llm/sdk';

export type PermissionsTableRowRelation = {
  permissions: {
    inherited: SdkPermissionsT;
    current: SdkPermissionsT;
  };
};
