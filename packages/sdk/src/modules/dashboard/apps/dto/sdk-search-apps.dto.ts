import { z } from 'zod';

import {
  DEFAULT_SDK_SORT,
  SdkArchivedFiltersInputV,
  SdkExcludeIdsFiltersInputV,
  SdkFilteredPhraseInputV,
  SdkIdsArrayV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
  SdkSortV,
} from '~/shared';

import { SdkCountedAppsCategoriesTreeV } from '../../apps-categories/dto/sdk-counted-apps-categories-tree.dto';
import { SdkAppV } from './sdk-app.dto';

export const SdkSearchAppItemV = SdkAppV;

export type SdkSearchAppItemT = z.infer<typeof SdkSearchAppItemV>;

export const SdkAppsSortV = SdkSortV([
  'promotion:desc',
  ...DEFAULT_SDK_SORT,
]);

export type SdkAppsSortT = z.infer<typeof SdkAppsSortV>;

export const SdkSearchAppsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    categoriesIds: SdkIdsArrayV.optional(),
    sort: SdkAppsSortV.optional(),
  })
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkExcludeIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchAppsInputT = z.infer<typeof SdkSearchAppsInputV>;

export const SdkSearchAppsAggsV = z.object({
  categories: SdkCountedAppsCategoriesTreeV,
});

export type SdkSearchAppsAggsT = z.infer<typeof SdkSearchAppsAggsV>;

export const SdkSearchAppsOutputV = SdkOffsetPaginationOutputV(SdkSearchAppItemV).extend({
  aggs: SdkSearchAppsAggsV,
});

export type SdkSearchAppsOutputT = z.infer<typeof SdkSearchAppsOutputV>;
