import { z } from 'zod';

import { SdkTableRowIdV } from './sdk-table-row-id.dto';

export const SdkArchivedFiltersInputV = z.object({
  archived: z.coerce.boolean().optional().default(false),
});

export const SdkIdsFiltersInputV = z.object({
  ids: z.array(SdkTableRowIdV).optional(),
});

export const SdkFilteredPhraseInputV = z.object({
  phrase: z.string().optional(),
});
