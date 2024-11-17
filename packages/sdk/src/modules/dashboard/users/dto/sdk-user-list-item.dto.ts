import { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

export const SdkUserListItemV = SdkTableRowWithIdV.extend({
  email: z.string(),
});

export type SdkUserListItemT = z.infer<typeof SdkUserListItemV>;
