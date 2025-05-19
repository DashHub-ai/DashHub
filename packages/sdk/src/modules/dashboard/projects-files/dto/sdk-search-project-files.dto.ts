import type { z } from 'zod';

import { StrictBooleanV } from '@dashhub/commons';
import {
  SdkDefaultSortInputV,
  SdkFilteredPhraseInputV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkProjectFileV } from './sdk-project-file.dto';

export const SdkSearchProjectFileItemV = SdkProjectFileV;

export type SdkSearchProjectFileItemT = z.infer<typeof SdkSearchProjectFileItemV>;

export const SdkSearchProjectFilesInputV = SdkOffsetPaginationInputV
  .extend({
    ignoreAttachedToMessages: StrictBooleanV.default(true).optional(),
  })
  .merge(SdkDefaultSortInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchProjectFilesInputT = z.infer<typeof SdkSearchProjectFilesInputV>;

export const SdkSearchProjectFilesOutputV = SdkOffsetPaginationOutputV(SdkSearchProjectFileItemV);

export type SdkSearchProjectFilesOutputT = z.infer<typeof SdkSearchProjectFilesOutputV>;
