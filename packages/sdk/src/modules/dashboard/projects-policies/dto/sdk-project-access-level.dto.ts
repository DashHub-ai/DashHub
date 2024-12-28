import { z } from 'zod';

export const SdkProjectAccessLevelV = z.enum(['read', 'write', 'admin']);

export type SdkProjectAccessLevelT = z.infer<typeof SdkProjectAccessLevelV>;
