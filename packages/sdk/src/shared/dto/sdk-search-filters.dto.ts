import { z } from 'zod';

import { StrictNullableBooleanV } from '@dashhub/commons';

import { SdkIdsArrayV } from './sdk-ids-array.dto';
import { SdkUuidsArrayV } from './sdk-uuids-array.dto';

export const SdkArchivedFiltersInputV = z.object({
  archived: StrictNullableBooleanV.optional().default(false),
});

export const SdkIdsFiltersInputV = z.object({
  ids: SdkIdsArrayV.optional(),
});

export const SdkExcludeIdsFiltersInputV = z.object({
  excludeIds: SdkIdsArrayV.optional(),
});

export const SdkUuidsFiltersInputV = z.object({
  ids: SdkUuidsArrayV.optional(),
});
