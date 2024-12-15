import type { z } from 'zod';

import { SdkTableRowWithIdNameV } from '~/shared';

import { SdkBaseS3FileV } from '../../s3-files/dto/sdk-base-s3-file.dto';

export const SdkProjectFileV = SdkBaseS3FileV.extend({
  project: SdkTableRowWithIdNameV,
});

export type SdkProjectFileT = z.infer<typeof SdkProjectFileV>;
