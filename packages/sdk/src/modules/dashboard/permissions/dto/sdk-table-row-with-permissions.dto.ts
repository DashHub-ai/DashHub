import { z } from 'zod';

import { SdkPermissionsV } from './sdk-permission.dto';

export const SdkTableRowWithPermissionsV = z.object({
  permissions: SdkPermissionsV.nullable().optional(),
});

export type SdkTableRowWithPermissionsT = z.infer<typeof SdkTableRowWithPermissionsV>;

export function isSdkRecordWithPermissions(value: unknown): value is SdkTableRowWithPermissionsT {
  return SdkTableRowWithPermissionsV.safeParse(value).success;
}
