import { z } from 'zod';

export const SdkEmailLoginInputV = z.object({
  email: z.string(),
});

export type SdkEmailLoginInputT = z.infer<typeof SdkEmailLoginInputV>;
