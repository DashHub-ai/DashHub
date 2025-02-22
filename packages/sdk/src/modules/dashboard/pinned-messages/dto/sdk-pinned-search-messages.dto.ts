import type { z } from 'zod';

import {
  SdkDefaultSortInputV,
  SdkExcludeIdsFiltersInputV,
  SdkFilteredPhraseInputV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkPinnedMessageV } from './sdk-pinned-message.dto';

export const SdkSearchPinnedMessageItemV = SdkPinnedMessageV;

export type SdkSearchPinnedMessageItemT = z.infer<typeof SdkSearchPinnedMessageItemV>;

export const SdkPinnedMessagesSortV = SdkDefaultSortInputV;

export type SdkPinnedMessagesSortT = z.infer<typeof SdkPinnedMessagesSortV>;

export const SdkSearchPinnedMessagesInputV = SdkOffsetPaginationInputV
  .merge(SdkDefaultSortInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkExcludeIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchPinnedMessagesInputT = z.infer<typeof SdkSearchPinnedMessagesInputV>;

export const SdkSearchPinnedMessagesOutputV = SdkOffsetPaginationOutputV(SdkSearchPinnedMessageItemV);

export type SdkSearchPinnedMessagesOutputT = z.infer<typeof SdkSearchPinnedMessagesOutputV>;
