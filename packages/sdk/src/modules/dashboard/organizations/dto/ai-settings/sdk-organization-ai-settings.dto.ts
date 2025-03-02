import { z } from 'zod';

export const SdkOrganizationAISettingsV = z.object({
  chatContext: z.string().nullable(),
});

export type SdkOrganizationAISettingsT = z.infer<typeof SdkOrganizationAISettingsV>;
