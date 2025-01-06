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

export const SdkSearchOrganizationsInputV = SdkOffsetPaginationInputV
  .merge(SdkDefaultSortInputV)
  .merge(SdkArchivedFiltersInputV)
  .merge(SdkIdsFiltersInputV)
  .merge(SdkFilteredPhraseInputV);

export type SdkSearchOrganizationsInputT = z.infer<typeof SdkSearchOrganizationsInputV>;

export const SdkSearchOrganizationsOutputV = SdkOffsetPaginationOutputV(SdkSearchOrganizationItemV);

export type SdkSearchOrganizationsOutputT = z.infer<typeof SdkSearchOrganizationsOutputV>;
