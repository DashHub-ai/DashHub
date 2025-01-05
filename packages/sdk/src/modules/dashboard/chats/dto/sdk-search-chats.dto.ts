import type { z } from 'zod';

import {
  SdkArchivedFiltersInputV,
  SdkDefaultSortInputV,
  SdkFilteredPhraseInputV,
  SdkIdsArrayV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
  SdkUuidsFiltersInputV,
} from '~/shared';

import { SdkChatV } from './sdk-chat.dto';

export const SdkSearchChatItemV = SdkChatV;

export type SdkSearchChatItemT = z.infer<typeof SdkSearchChatItemV>;

export const SdKSearchChatsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    projectsIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkUuidsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchChatsInputT = z.infer<typeof SdKSearchChatsInputV>;

export const SdKSearchChatsOutputV = SdkOffsetPaginationOutputV(SdkSearchChatItemV);

export type SdKSearchChatsOutputT = z.infer<typeof SdKSearchChatsOutputV>;
