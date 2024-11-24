import type { z } from 'zod';

import {
  SdkDefaultSortInputV,
  SdkFilteredPhraseInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
  SdkUuidsArrayV,
  SdkUuidsFiltersInputV,
} from '~/shared';

import { SdkMessageV } from './sdk-message.dto';

export const SdkSearchMessageItemV = SdkMessageV;

export type SdkSearchMessageItemT = z.infer<typeof SdkSearchMessageItemV>;

export const SdKSearchMessagesInputV = SdkOffsetPaginationInputV
  .extend({
    chatIds: SdkUuidsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkUuidsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchMessagesInputT = z.infer<typeof SdKSearchMessagesInputV>;

export const SdKSearchMessagesOutputV = SdkOffsetPaginationOutputV(SdkSearchMessageItemV);

export type SdKSearchMessagesOutputT = z.infer<typeof SdKSearchMessagesOutputV>;