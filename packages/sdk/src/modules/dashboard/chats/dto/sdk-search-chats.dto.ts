import type { z } from 'zod';

import { StrictBooleanV } from '@dashhub/commons';
import {
  DEFAULT_SDK_SORT,
  SdkArchivedFiltersInputV,
  SdkFilteredPhraseInputV,
  SdkIdsArrayV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
  SdkSortV,
  SdkUuidsFiltersInputV,
} from '~/shared';

import { SdkChatV } from './sdk-chat.dto';

export const SdkSearchChatItemV = SdkChatV;

export type SdkSearchChatItemT = z.infer<typeof SdkSearchChatItemV>;

export const SdkChatsSortV = SdkSortV([
  'favorites:desc',
  'favoritesFirst:createdAt:desc',
  ...DEFAULT_SDK_SORT,
]);

export type SdkChatsSortT = z.infer<typeof SdkChatsSortV>;

export const SdkSearchChatsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    projectsIds: SdkIdsArrayV.optional(),
    creatorIds: SdkIdsArrayV.optional(),
    excludeEmpty: StrictBooleanV.optional(),
    favorites: StrictBooleanV.optional(),
    sort: SdkChatsSortV.optional(),
  })
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkUuidsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchChatsInputT = z.infer<typeof SdkSearchChatsInputV>;

export const SdkSearchChatsOutputV = SdkOffsetPaginationOutputV(SdkSearchChatItemV);

export type SdkSearchChatsOutputT = z.infer<typeof SdkSearchChatsOutputV>;
