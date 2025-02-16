import { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';
import { SdkTableRowUuidV } from '~/shared';

export const SdkCreateMessageInputV = z.object({
  content: z.string(),
  replyToMessageId: SdkTableRowUuidV.optional().nullable(),
  files: z.array(z.instanceof(File)).optional().nullable(),
  webSearch: StrictBooleanV.optional(),
});

export type SdkCreateMessageInputT = z.infer<typeof SdkCreateMessageInputV>;
