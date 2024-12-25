import { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

import { SdkBaseS3ResourceV } from '../../s3-files/dto/sdk-base-s3-resource.dto';

export const SdkMessageFileV = z.object({
  resource: SdkBaseS3ResourceV,
})
  .merge(SdkTableRowWithIdV);

export type SdkProjectFileT = z.infer<typeof SdkMessageFileV>;
