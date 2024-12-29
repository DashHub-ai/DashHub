import { z } from 'zod';

export const SDK_PROJECT_ACCESS_LEVELS = ['read', 'write', 'admin'] as const;

export const SdkProjectAccessLevelV = z.enum(SDK_PROJECT_ACCESS_LEVELS);

export type SdkProjectAccessLevelT = z.infer<typeof SdkProjectAccessLevelV>;
