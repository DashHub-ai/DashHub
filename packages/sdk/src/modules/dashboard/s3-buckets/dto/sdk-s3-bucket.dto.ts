import { z } from 'zod';

import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkS3BucketV = z.object({
  organization: SdkIdNameUrlEntryV,
  default: z.boolean(),
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkS3BucketT = z.infer<typeof SdkS3BucketV>;
