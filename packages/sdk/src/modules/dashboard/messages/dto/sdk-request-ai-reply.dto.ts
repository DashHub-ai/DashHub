import { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

export const SdkRequestAIReplyInputV = z.object({
  aiModel: SdkTableRowWithIdV,
  preferredLanguageCode: z.string().optional(),
});

export type SdkRequestAIReplyInputT = z.infer<typeof SdkRequestAIReplyInputV>;
