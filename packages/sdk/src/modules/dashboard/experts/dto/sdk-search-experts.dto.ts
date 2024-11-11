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

import { SdkExpertV } from './sdk-expert.dto';

export const SdkSearchExpertItemV = SdkExpertV;

export type SdkSearchExpertItemT = z.infer<typeof SdkSearchExpertItemV>;

export const SdKSearchExpertsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchExpertsInputT = z.infer<typeof SdKSearchExpertsInputV>;

export const SdKSearchExpertsOutputV = SdkOffsetPaginationOutputV(SdkSearchExpertItemV);

export type SdKSearchExpertsOutputT = z.infer<typeof SdKSearchExpertsOutputV>;
