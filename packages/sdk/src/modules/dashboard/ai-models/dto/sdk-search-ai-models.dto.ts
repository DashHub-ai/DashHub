import type { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';
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

export const SdkSearchAIModelsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    default: StrictBooleanV.optional(),
    embedding: StrictBooleanV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchAIModelsInputT = z.infer<typeof SdkSearchAIModelsInputV>;

export const SdkSearchAIModelsOutputV = SdkOffsetPaginationOutputV(SdkSearchAIModelItemV);

export type SdkSearchAIModelsOutputT = z.infer<typeof SdkSearchAIModelsOutputV>;
