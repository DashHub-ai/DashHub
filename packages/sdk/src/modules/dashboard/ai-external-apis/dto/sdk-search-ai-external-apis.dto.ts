import type { z } from 'zod';

import {
  SdkArchivedFiltersInputV,
  SdkDefaultSortInputV,
  SdkExcludeIdsFiltersInputV,
  SdkFilteredPhraseInputV,
  SdkIdsArrayV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkAIExternalApiV } from './sdk-ai-external-api.dto';

export const SdkSearchAIExternalAPIItemV = SdkAIExternalApiV;

export type SdkSearchAIExternalAPIItemT = z.infer<typeof SdkSearchAIExternalAPIItemV>;

export const SdkSearchAIExternalAPIsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkExcludeIdsFiltersInputV)
  .merge(SdkDefaultSortInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchAIExternalAPIsInputT = z.infer<typeof SdkSearchAIExternalAPIsInputV>;

export const SdkSearchAIExternalAPIsOutputV = SdkOffsetPaginationOutputV(SdkSearchAIExternalAPIItemV);

export type SdkSearchAIExternalAPIsOutputT = z.infer<typeof SdkSearchAIExternalAPIsOutputV>;
