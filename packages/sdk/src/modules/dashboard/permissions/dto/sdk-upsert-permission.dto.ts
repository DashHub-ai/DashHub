import { z } from 'zod';

import { SdkPermissionAccessLevelV } from './sdk-permission-level.dto';
import { SdkUpsertPermissionTargetV } from './sdk-permission-target.dto';

export const SdkUpsertPermissionV = z.object({
  accessLevel: SdkPermissionAccessLevelV,
  target: SdkUpsertPermissionTargetV,
});

export type SdkUpsertPermissionT = z.infer<typeof SdkUpsertPermissionV>;

export const SdkUpsertPermissionsV = z.array(SdkUpsertPermissionV);

export type SdkUpsertPermissionsT = z.infer<typeof SdkUpsertPermissionsV>;
