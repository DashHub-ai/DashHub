import type { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';
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

import { SdkAppCategoryV } from './sdk-app-category.dto';

export const SdkSearchAppCategoryItemV = SdkAppCategoryV;

export type SdkSearchAppCategoryItemT = z.infer<typeof SdkSearchAppCategoryItemV>;

export const SdKSearchAppsCategoriesInputV = SdkOffsetPaginationInputV
  .extend({
    root: StrictBooleanV.optional(),
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkExcludeIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchAppsCategoriesInputT = z.infer<typeof SdKSearchAppsCategoriesInputV>;

export const SdkSearchAppsCategoriesOutputV = SdkOffsetPaginationOutputV(SdkSearchAppCategoryItemV);

export type SdkSearchAppsCategoriesOutputT = z.infer<typeof SdkSearchAppsCategoriesOutputV>;
