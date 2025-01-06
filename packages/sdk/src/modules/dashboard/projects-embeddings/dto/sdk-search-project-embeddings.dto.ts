import type { z } from 'zod';

import {
  SdkDefaultSortInputV,
  SdkIdsArrayV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkProjectEmbeddingV } from './sdk-project-embedding.dto';

export const SdkSearchProjectEmbeddingItemV = SdkProjectEmbeddingV;

export type SdkSearchProjectEmbeddingItemT = z.infer<typeof SdkSearchProjectEmbeddingItemV>;

export const SdkSearchProjectEmbeddingsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    projectsIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkIdsFiltersInputV);

export type SdkSearchProjectEmbeddingsInputT = z.infer<typeof SdkSearchProjectEmbeddingsInputV>;

export const SdkSearchProjectEmbeddingsOutputV = SdkOffsetPaginationOutputV(SdkSearchProjectEmbeddingItemV);

export type SdkSearchProjectEmbeddingsOutputT = z.infer<typeof SdkSearchProjectEmbeddingsOutputV>;
