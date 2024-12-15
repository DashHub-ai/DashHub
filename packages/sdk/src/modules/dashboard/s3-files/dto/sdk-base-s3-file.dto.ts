import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdNameV } from '~/shared';

export const SdkBaseS3FileTypeV = z.enum(['other', 'image']);

export const SdkBaseS3FileV = z.object({
  publicUrl: z.string(),
  bucket: SdkTableRowWithIdNameV,
  type: SdkBaseS3FileTypeV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV);

export type SdkBaseS3FileT = z.infer<typeof SdkBaseS3FileV>;
