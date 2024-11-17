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

import { SdkChatV } from './sdk-chat.dto';

export const SdkSearchChatItemV = SdkChatV;

export type SdkSearchChatItemT = z.infer<typeof SdkSearchChatItemV>;

export const SdKSearchChatsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchChatsInputT = z.infer<typeof SdKSearchChatsInputV>;

export const SdKSearchChatsOutputV = SdkOffsetPaginationOutputV(SdkSearchChatItemV);

export type SdKSearchChatsOutputT = z.infer<typeof SdKSearchChatsOutputV>;
