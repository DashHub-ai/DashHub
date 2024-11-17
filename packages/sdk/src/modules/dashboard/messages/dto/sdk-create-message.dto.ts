import { z } from 'zod';

export const SdkCreateMessageInputV = z.object({
  content: z.string(),
});

export type SdkCreateMessageInputT = z.infer<typeof SdkCreateMessageInputV>;
