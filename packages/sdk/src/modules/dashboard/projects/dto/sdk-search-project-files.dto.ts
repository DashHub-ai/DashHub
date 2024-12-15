import type { z } from 'zod';

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
  .merge(SdkDefaultSortInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchProjectFilesInputT = z.infer<typeof SdkSearchProjectFilesInputV>;

export const SdKSearchProjectFilesOutputV = SdkOffsetPaginationOutputV(SdkSearchProjectFileItemV);

export type SdKSearchProjectFilesOutputT = z.infer<typeof SdKSearchProjectFilesOutputV>;
