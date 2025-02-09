import { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

export const SdkUserListItemV = SdkTableRowWithIdV.extend({
  email: z.string(),
  name: z.string(),
  avatar: z.object({
    publicUrl: z.string(),
  }).optional().nullable(),
});

export type SdkUserListItemT = z.infer<typeof SdkUserListItemV>;
