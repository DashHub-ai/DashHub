import { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

export const SdkOrganizationAISettingsV = z.object({
  chatContext: z.string().nullable(),
  project: SdkTableRowWithIdV,
});

export type SdkOrganizationAISettingsT = z.infer<typeof SdkOrganizationAISettingsV>;
