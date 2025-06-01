import { z } from 'zod';

import { SdkTableRowWithIdV, SdkTableRowWithUuidV } from '~/shared';

export const SdkInstallAgentsLibraryAgentInputV = z.object({
  lang: z.string().optional().default('en'),
  category: SdkTableRowWithIdV,
  organization: SdkTableRowWithIdV,
  agent: SdkTableRowWithUuidV,
});

export type SdkInstallAgentsLibraryAgentInputT = z.infer<typeof SdkInstallAgentsLibraryAgentInputV>;
