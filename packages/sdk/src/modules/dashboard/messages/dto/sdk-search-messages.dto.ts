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

export const SdkSearchMessagesInputV = SdkOffsetPaginationInputV
  .extend({
    chatIds: SdkUuidsArrayV.optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkUuidsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchMessagesInputT = z.infer<typeof SdkSearchMessagesInputV>;

export const SdkSearchMessagesOutputV = SdkOffsetPaginationOutputV(SdkSearchMessageItemV);

export type SdkSearchMessagesOutputT = z.infer<typeof SdkSearchMessagesOutputV>;
