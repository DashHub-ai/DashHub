import { z } from 'zod';

import { SdkPermissionResourceV, SdkPermissionTargetV } from './sdk-permission.dto';

export const SdkUpsertPermissionInputV = z.object({
  accessLevel: z.string(),
  target: SdkPermissionTargetV,
});

export type SdkUpsertPermissionInputT = z.infer<typeof SdkUpsertPermissionInputV>;

export const SdkUpsertPermissionsInputV = z.object({
  resource: SdkPermissionResourceV,
  permissions: z.array(SdkUpsertPermissionInputV),
});

export type SdkUpsertPermissionsInputT = z.infer<typeof SdkUpsertPermissionsInputV>;
