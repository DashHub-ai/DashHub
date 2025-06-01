import { z } from 'zod';

import { SdkTableRowWithIdV, SdkTableRowWithUuidV } from '~/shared';

export const SdkInstalledAppMetadataV = z.object({
  app: SdkTableRowWithIdV,
  libraryAgent: SdkTableRowWithUuidV,
});

export type SdkInstalledAppMetadataT = z.infer<typeof SdkInstalledAppMetadataV>;
