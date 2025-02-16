import { z } from 'zod';

import { SdkTableRowUuidV } from '~/shared';

export const SdkCreateMessageInputV = z.object({
  content: z.string(),
  replyToMessageId: SdkTableRowUuidV.optional().nullable(),
  files: z.array(z.instanceof(File)).optional().nullable(),
  webSearch: z.boolean().optional(),
});

export type SdkCreateMessageInputT = z.infer<typeof SdkCreateMessageInputV>;
