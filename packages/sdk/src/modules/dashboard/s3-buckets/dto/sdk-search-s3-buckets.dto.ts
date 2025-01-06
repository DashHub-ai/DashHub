import type { z } from 'zod';

import {
  SdkArchivedFiltersInputV,
  SdkDefaultSortInputV,
  SdkFilteredPhraseInputV,
  SdkIdsArrayV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkS3BucketV } from './sdk-s3-bucket.dto';

export const SdkSearchS3BucketItemV = SdkS3BucketV;

export type SdkSearchS3BucketItemT = z.infer<typeof SdkSearchS3BucketItemV>;

export const SdkSearchS3BucketsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchS3BucketsInputT = z.infer<typeof SdkSearchS3BucketsInputV>;

export const SdkSearchS3BucketsOutputV = SdkOffsetPaginationOutputV(SdkSearchS3BucketItemV);

export type SdkSearchS3BucketsOutputT = z.infer<typeof SdkSearchS3BucketsOutputV>;
