import { z } from 'zod';

import { SdkTableRowIdV, SdkTableRowUuidV } from '~/shared';

export const SdkUpsertFavoriteV = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('app'),
    id: SdkTableRowIdV,
  }),
  z.object({
    type: z.literal('chat'),
    id: SdkTableRowUuidV,
  }),
]);

export type SdkUpsertFavoriteT = z.infer<typeof SdkUpsertFavoriteV>;
