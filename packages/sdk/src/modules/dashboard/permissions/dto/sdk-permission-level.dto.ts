import { z } from 'zod';

export const SDK_PERMISSION_ACCESS_LEVELS = ['read', 'write'] as const;

export const SdkPermissionAccessLevelV = z.enum(SDK_PERMISSION_ACCESS_LEVELS);

export type SdkPermissionAccessLevelT = z.infer<typeof SdkPermissionAccessLevelV>;
