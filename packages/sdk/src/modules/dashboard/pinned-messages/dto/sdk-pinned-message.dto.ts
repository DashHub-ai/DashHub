import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdV } from '~/shared';

import { SdkMessageV } from '../../messages';
import { SdkUserListItemV } from '../../users';

export const SdkPinnedMessageV = z.strictObject({
  message: SdkMessageV,
  creator: SdkUserListItemV,
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkPinnedMessageT = z.infer<typeof SdkPinnedMessageV>;
