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

export const SdkSearchUsersGroupsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    usersIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkExcludeIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchUsersGroupsInputT = z.infer<typeof SdkSearchUsersGroupsInputV>;

export const SdkSearchUsersGroupsOutputV = SdkOffsetPaginationOutputV(SdkSearchUsersGroupItemV);

export type SdkSearchUsersGroupsOutputT = z.infer<typeof SdkSearchUsersGroupsOutputV>;
