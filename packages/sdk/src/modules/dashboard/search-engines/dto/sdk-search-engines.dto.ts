import type { z } from 'zod';

import { StrictBooleanV } from '@dashhub/commons';
import {
  SdkArchivedFiltersInputV,
  SdkDefaultSortInputV,
  SdkFilteredPhraseInputV,
  SdkIdsArrayV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkSearchEngineV } from './sdk-search-engine.dto';

export const SdkSearchSearchEngineItemV = SdkSearchEngineV;

export type SdkSearchSearchEngineItemT = z.infer<typeof SdkSearchSearchEngineItemV>;

export const SdkSearchSearchEnginesInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    default: StrictBooleanV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchSearchEnginesInputT = z.infer<typeof SdkSearchSearchEnginesInputV>;

export const SdkSearchSearchEnginesOutputV = SdkOffsetPaginationOutputV(SdkSearchSearchEngineItemV);

export type SdkSearchSearchEnginesOutputT = z.infer<typeof SdkSearchSearchEnginesOutputV>;
