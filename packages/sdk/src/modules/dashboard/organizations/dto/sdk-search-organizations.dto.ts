import type { z } from 'zod';

import {
  SdkArchivedFiltersInputV,
  SdkDefaultSortInputV,
  SdkFilteredPhraseInputV,
  SdkIdsFiltersInputV,
  SdkOffsetPaginationInputV,
  SdkOffsetPaginationOutputV,
} from '~/shared';

import { SdkOrganizationV } from './sdk-organization.dto';

export const SdkSearchOrganizationItemV = SdkOrganizationV;

export type SdkSearchOrganizationItemT = z.infer<typeof SdkSearchOrganizationItemV>;

export const SdKSearchOrganizationsInputV = SdkOffsetPaginationInputV
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdKSearchOrganizationsInputT = z.infer<typeof SdKSearchOrganizationsInputV>;

export const SdKSearchOrganizationsOutputV = SdkOffsetPaginationOutputV(SdkSearchOrganizationItemV);

export type SdKSearchOrganizationsOutputT = z.infer<typeof SdKSearchOrganizationsOutputV>;
