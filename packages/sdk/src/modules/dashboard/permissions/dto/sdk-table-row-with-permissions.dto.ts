import { z } from 'zod';

import { SdkPermissionAccessLevelV } from './sdk-permission-level.dto';
import { SdkPermissionsV } from './sdk-permission.dto';

export const SdkTableRowWithPermissionsV = z.object({
  permissions: SdkPermissionsV.extend({
    yourAccessLevel: SdkPermissionAccessLevelV.optional(),
  }),
});

export type SdkTableRowWithPermissionsT = z.infer<typeof SdkTableRowWithPermissionsV>;

export function isSdkRecordWithPermissions(value: unknown): value is SdkTableRowWithPermissionsT {
  return SdkTableRowWithPermissionsV.safeParse(value).success;
}
