import { z } from 'zod';

import { SdkTableRowIdV, SdkTableRowUuidV } from '~/shared';

export const SdkFavoriteV = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('app'),
    id: SdkTableRowIdV,
  }),
  z.object({
    type: z.literal('chat'),
    id: SdkTableRowUuidV,
  }),
]);

export type SdkFavoriteT = z.infer<typeof SdkFavoriteV>;

export type SdkFavoriteTypeT = SdkFavoriteT['type'];

export type SdkInferFavoriteT<T extends SdkFavoriteTypeT> = Extract<SdkFavoriteT, { type: T; }>;

export type SdkInferFavoriteIdT<T extends SdkFavoriteTypeT> = Extract<SdkFavoriteT, { type: T; }>['id'];
