import { expectTypeOf } from 'expect-type';
import { z } from 'zod';

import { SdkTableRowIdV, SdkTableRowUuidV } from '~/shared';

export const SdkPermissionResourceV = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('chat'),
    id: SdkTableRowUuidV,
  }),
  z.object({
    type: z.literal('project'),
    id: SdkTableRowIdV,
  }),
  z.object({
    type: z.literal('app'),
    id: SdkTableRowIdV,
  }),
]);

export type SdkPermissionResourceT = z.infer<typeof SdkPermissionResourceV>;

export const SdkPermissionResourceTypeV = z.union([
  z.literal('chat'),
  z.literal('project'),
  z.literal('app'),
]);

export type SdkPermissionResourceTypeT = z.infer<typeof SdkPermissionResourceTypeV>;

expectTypeOf<SdkPermissionResourceTypeT>().toEqualTypeOf<SdkPermissionResourceT['type']>();
