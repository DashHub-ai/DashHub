import { z } from 'zod';

export const SdkUserAISettingsV = z.object({
  chatContext: z.string().nullable(),
});

export type SdkUserAISettingsT = z.infer<typeof SdkUserAISettingsV>;
