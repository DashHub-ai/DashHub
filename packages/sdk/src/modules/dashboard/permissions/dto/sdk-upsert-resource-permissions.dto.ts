import { z } from 'zod';

import { SdkPermissionAccessLevelV } from './sdk-permission-level.dto';
import { SdkPermissionTargetV } from './sdk-permission.dto';

export const SdkUpsertPermissionInputV = z.object({
  accessLevel: SdkPermissionAccessLevelV,
  target: SdkPermissionTargetV,
});

export type SdkUpsertPermissionInputT = z.infer<typeof SdkUpsertPermissionInputV>;

export const SdkUpsertResourcePermissionsInputV = z.array(SdkUpsertPermissionInputV);

export type SdkUpsertResourcePermissionsInputT = z.infer<typeof SdkUpsertResourcePermissionsInputV>;
