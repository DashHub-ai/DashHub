import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdNameV, SdkTableRowWithIdV } from '~/shared';

import { SdkBaseS3ResourceV } from '../../s3-files/dto/sdk-base-s3-resource.dto';

export const SdkProjectFileV = z.object({
  resource: SdkBaseS3ResourceV,
  project: SdkTableRowWithIdNameV,
  description: z.string().nullable(),
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkProjectFileT = z.infer<typeof SdkProjectFileV>;
