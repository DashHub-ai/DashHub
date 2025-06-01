import { z } from 'zod';

import { SdkTableRowWithIdV, SdkTableRowWithUuidV } from '~/shared';

export const SdkInstallAgentsLibraryAgentInputV = z.object({
  organization: SdkTableRowWithIdV,
  agent: SdkTableRowWithUuidV,
});

export type SdkInstallAgentsLibraryAgentInputT = z.infer<typeof SdkInstallAgentsLibraryAgentInputV>;
