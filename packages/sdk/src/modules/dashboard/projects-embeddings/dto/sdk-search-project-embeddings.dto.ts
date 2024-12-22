import type { z } from 'zod';

import {
  SdkDefaultSortInputV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkProjectEmbeddingV } from './sdk-project-embedding.dto';

export const SdkSearchProjectEmbeddingItemV = SdkProjectEmbeddingV;

export type SdkSearchProjectEmbeddingItemT = z.infer<typeof SdkSearchProjectEmbeddingItemV>;

export const SdkSearchProjectEmbeddingsInputV = SdkOffsetPaginationInputV
  .merge(SdkDefaultSortInputV)
  .merge(SdkIdsFiltersInputV);

export type SdkSearchProjectEmbeddingsInputT = z.infer<typeof SdkSearchProjectEmbeddingsInputV>;

export const SdKSearchProjectEmbeddingsOutputV = SdkOffsetPaginationOutputV(SdkSearchProjectEmbeddingItemV);

export type SdKSearchProjectEmbeddingsOutputT = z.infer<typeof SdKSearchProjectEmbeddingsOutputV>;
