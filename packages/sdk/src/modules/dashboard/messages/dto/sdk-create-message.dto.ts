import { z } from 'zod';

import { SdkTableRowWithUuidV } from '~/shared';

export const SdkCreateMessageInputV = z.object({
  content: z.string(),
  replyToMessage: SdkTableRowWithUuidV.optional().nullable(),
});

export type SdkCreateMessageInputT = z.infer<typeof SdkCreateMessageInputV>;
