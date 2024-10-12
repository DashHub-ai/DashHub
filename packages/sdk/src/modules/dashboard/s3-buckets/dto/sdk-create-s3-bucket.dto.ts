import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkS3BucketV } from './sdk-s3-bucket.dto';

export const SdkCreateS3BucketInputV = SdkS3BucketV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
})
  .extend({
    organization: SdkTableRowWithIdV,
  });

export type SdkCreateS3BucketInputT = z.infer<typeof SdkCreateS3BucketInputV>;

export const SdkCreateS3BucketOutputV = SdkTableRowWithIdV;

export type SdkCreateS3BucketOutputT = z.infer<typeof SdkCreateS3BucketOutputV>;
