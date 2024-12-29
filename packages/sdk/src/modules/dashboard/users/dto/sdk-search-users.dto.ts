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

import { SdkUserV } from './sdk-user.dto';

export const SdkSearchUserItemV = SdkUserV;

export type SdkSearchUserItemT = z.infer<typeof SdkSearchUserItemV>;

export const SdkSearchUsersInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchUsersInputT = z.infer<typeof SdkSearchUsersInputV>;

export const SdKSearchUsersOutputV = SdkOffsetPaginationOutputV(SdkSearchUserItemV);

export type SdKSearchUsersOutputT = z.infer<typeof SdKSearchUsersOutputV>;
