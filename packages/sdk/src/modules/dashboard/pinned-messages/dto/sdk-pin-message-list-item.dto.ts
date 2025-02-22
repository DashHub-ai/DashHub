import type { z } from 'zod';

import { SdkTableRowUuidV, SdkTableRowWithIdV } from '~/shared';

export const SdkPinMessageListItemV = SdkTableRowWithIdV.extend({
  messageId: SdkTableRowUuidV,
});

export type SdkPinMessageListItemT = z.infer<typeof SdkPinMessageListItemV>;
