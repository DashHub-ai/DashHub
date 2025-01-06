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

export const SdkSearchExpertsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchExpertsInputT = z.infer<typeof SdkSearchExpertsInputV>;

export const SdkSearchExpertsOutputV = SdkOffsetPaginationOutputV(SdkSearchExpertItemV);

export type SdkSearchExpertsOutputT = z.infer<typeof SdkSearchExpertsOutputV>;
