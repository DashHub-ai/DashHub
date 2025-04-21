import { z } from 'zod';

import { SdkTableRowIdV } from '~/shared';

export const SdkSearchAllFavoritesInputV = z.object({
  organizationId: SdkTableRowIdV.optional().nullable(),
});

export type SdkSearchAllFavoritesInputT = z.infer<typeof SdkSearchAllFavoritesInputV>;
