import { z } from 'zod';

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

import { SdkCountedAppsCategoriesTreeV } from '../../apps-categories/dto/sdk-counted-apps-categories-tree.dto';
import { SdkAppV } from './sdk-app.dto';

export const SdkSearchAppItemV = SdkAppV;

export type SdkSearchAppItemT = z.infer<typeof SdkSearchAppItemV>;

export const SdKSearchAppsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    categoriesIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkExcludeIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchAppsInputT = z.infer<typeof SdKSearchAppsInputV>;

export const SdkSearchAppsAggsV = z.object({
  categories: SdkCountedAppsCategoriesTreeV,
});

export type SdkSearchAppsAggsT = z.infer<typeof SdkSearchAppsAggsV>;

export const SdKSearchAppsOutputV = SdkOffsetPaginationOutputV(SdkSearchAppItemV).extend({
  aggs: SdkSearchAppsAggsV,
});

export type SdkSearchAppsOutputT = z.infer<typeof SdKSearchAppsOutputV>;
