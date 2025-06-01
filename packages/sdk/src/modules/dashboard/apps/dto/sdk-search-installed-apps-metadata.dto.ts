import { z } from 'zod';

import { SdkIdsArrayV } from '~/shared';

export const SdkSearchInstalledAppsMetadataInputV = z.object({
  organizationIds: SdkIdsArrayV.optional(),
});

export type SdkSearchInstalledAppsMetadataInputT = z.infer<typeof SdkSearchInstalledAppsMetadataInputV>;
