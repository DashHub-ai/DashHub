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

import { SdkAIModelV } from './sdk-ai-model.dto';

export const SdkSearchAIModelItemV = SdkAIModelV;

export type SdkSearchAIModelItemT = z.infer<typeof SdkSearchAIModelItemV>;

export const SdKSearchAIModelsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchAIModelsInputT = z.infer<typeof SdKSearchAIModelsInputV>;

export const SdKSearchAIModelsOutputV = SdkOffsetPaginationOutputV(SdkSearchAIModelItemV);

export type SdKSearchAIModelsOutputT = z.infer<typeof SdKSearchAIModelsOutputV>;
