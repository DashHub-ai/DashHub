import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdNameV } from '~/shared';

export const SdkBaseS3ResourceTypeV = z.enum(['other', 'image']);

export const SdkBaseS3ResourceV = z.object({
  publicUrl: z.string(),
  bucket: SdkTableRowWithIdNameV,
  type: SdkBaseS3ResourceTypeV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV);

export type SdkBaseS3ResourceT = z.infer<typeof SdkBaseS3ResourceV>;
