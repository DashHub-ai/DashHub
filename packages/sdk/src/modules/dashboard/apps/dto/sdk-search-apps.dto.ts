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

import { SdkAppV } from './sdk-app.dto';

export const SdkSearchAppItemV = SdkAppV;

export type SdkSearchAppItemT = z.infer<typeof SdkSearchAppItemV>;

export const SdKSearchAppsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkExcludeIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchAppsInputT = z.infer<typeof SdKSearchAppsInputV>;

export const SdKSearchAppsOutputV = SdkOffsetPaginationOutputV(SdkSearchAppItemV);

export type SdKSearchAppsOutputT = z.infer<typeof SdKSearchAppsOutputV>;
