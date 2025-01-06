import { z } from 'zod';

import { SdkPermissionAccessLevelV } from './sdk-permission-level.dto';
import { SdkPermissionTargetV } from './sdk-permission-target.dto';

export const SdkPermissionV = z.object({
  accessLevel: SdkPermissionAccessLevelV,
  target: SdkPermissionTargetV,
});

export type SdkPermissionT = z.infer<typeof SdkPermissionV>;

export const SdkPermissionsV = z.object({
  inherited: z.array(SdkPermissionV),
  current: z.array(SdkPermissionV),
});

export type SdkPermissionsT = z.infer<typeof SdkPermissionsV>;
