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

import { SdkProjectV } from './sdk-project.dto';

export const SdkSearchProjectItemV = SdkProjectV;

export type SdkSearchProjectItemT = z.infer<typeof SdkSearchProjectItemV>;

export const SdkSearchProjectsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchProjectsInputT = z.infer<typeof SdkSearchProjectsInputV>;

export const SdkSearchProjectsOutputV = SdkOffsetPaginationOutputV(SdkSearchProjectItemV);

export type SdkSearchProjectsOutputT = z.infer<typeof SdkSearchProjectsOutputV>;
