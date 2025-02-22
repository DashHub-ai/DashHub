import { z } from 'zod';

import { SdkTableRowUuidV } from '~/shared';

export const SdkPinMessageInputV = z.object({
  messageId: SdkTableRowUuidV,
});

export type SdkPinMessageInputT = z.infer<typeof SdkPinMessageInputV>;
