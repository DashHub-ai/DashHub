import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkS3BucketV } from './sdk-s3-bucket.dto';

export const SdkUpdateS3BucketInputV = SdkS3BucketV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
});

export type SdkUpdateS3BucketInputT = z.infer<typeof SdkUpdateS3BucketInputV>;

export const SdkUpdateS3BucketOutputV = SdkTableRowWithIdV;

export type SdkUpdateS3BucketOutputT = z.infer<typeof SdkUpdateS3BucketOutputV>;
