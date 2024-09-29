import { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';

import { SdkTableRowIdV } from './sdk-table-row-id.dto';

export const SdkArchivedFiltersInputV = z.object({
  archived: StrictBooleanV.optional(),
});

export const SdkIdsFiltersInputV = z.object({
  ids: z.array(SdkTableRowIdV).optional(),
});

export const SdkFilteredPhraseInputV = z.object({
  phrase: z.string().optional(),
});
