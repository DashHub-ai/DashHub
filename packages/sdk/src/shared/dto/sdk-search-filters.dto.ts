import { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';

import { SdkIdsArrayV } from './sdk-ids-array.dto';

export const SdkArchivedFiltersInputV = z.object({
  archived: StrictBooleanV.optional().default(false),
});

export const SdkIdsFiltersInputV = z.object({
  ids: SdkIdsArrayV.optional(),
});

export const SdkFilteredPhraseInputV = z.object({
  phrase: z.string().optional(),
});
