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

import { SdkUsersGroupV } from './sdk-users-group.dto';

export const SdkSearchUsersGroupItemV = SdkUsersGroupV;

export type SdkSearchUsersGroupItemT = z.infer<typeof SdkSearchUsersGroupItemV>;

export const SdKSearchUsersGroupsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkExcludeIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchUsersGroupsInputT = z.infer<typeof SdKSearchUsersGroupsInputV>;

export const SdKSearchUsersGroupsOutputV = SdkOffsetPaginationOutputV(SdkSearchUsersGroupItemV);

export type SdkSearchUsersGroupsOutputT = z.infer<typeof SdKSearchUsersGroupsOutputV>;
