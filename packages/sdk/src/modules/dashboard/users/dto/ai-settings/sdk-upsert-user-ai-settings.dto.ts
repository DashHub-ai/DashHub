import { z } from 'zod';

export const SdkUpsertUserAISettingsInputV = z.object({
  chatContext: z.string().nullable(),
});

export type SdkUpsertUserAISettingsInputT = z.infer<typeof SdkUpsertUserAISettingsInputV>;
