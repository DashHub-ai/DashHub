import type { z } from 'zod';

import {
  SdkArchivedFiltersInputV,
  SdkDefaultSortInputV,
  SdkFilteredPhraseInputV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkProjectV } from './sdk-project.dto';

export const SdkSearchProjectItemV = SdkProjectV;

export type SdkSearchProjectItemT = z.infer<typeof SdkSearchProjectItemV>;

export const SdKSearchProjectsInputV = SdkOffsetPaginationInputV
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchProjectsInputT = z.infer<typeof SdKSearchProjectsInputV>;

export const SdKSearchProjectsOutputV = SdkOffsetPaginationOutputV(SdkSearchProjectItemV);

export type SdKSearchProjectsOutputT = z.infer<typeof SdKSearchProjectsOutputV>;
