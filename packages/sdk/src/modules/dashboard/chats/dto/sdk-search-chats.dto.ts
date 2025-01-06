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

export const SdkSearchChatsInputV = SdkOffsetPaginationInputV
  .extend({
    organizationIds: SdkIdsArrayV.optional(),
    projectsIds: SdkIdsArrayV.optional(),
    creatorIds: SdkIdsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkUuidsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchChatsInputT = z.infer<typeof SdkSearchChatsInputV>;

export const SdkSearchChatsOutputV = SdkOffsetPaginationOutputV(SdkSearchChatItemV);

export type SdkSearchChatsOutputT = z.infer<typeof SdkSearchChatsOutputV>;
