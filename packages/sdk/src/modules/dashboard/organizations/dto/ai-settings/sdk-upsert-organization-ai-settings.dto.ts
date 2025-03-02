import { z } from 'zod';

export const SdkUpsertOrganizationAISettingsInputV = z.object({
  chatContext: z.string().nullable(),
});

export type SdkUpsertOrganizationAISettingsInputT = z.infer<typeof SdkUpsertOrganizationAISettingsInputV>;
