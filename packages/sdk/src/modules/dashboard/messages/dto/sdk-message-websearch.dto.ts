import { z } from 'zod';

export const SdkMessageWebSearchItemV = z.object({
  title: z.string(),
  url: z.string(),
  description: z.string(),
});

export type SdkMessageWebSearchItemT = z.infer<typeof SdkMessageWebSearchItemV>;

export const SdkMessageWebSearchV = z.object({
  enabled: z.boolean(),
  results: z.array(SdkMessageWebSearchItemV),
});

export type SdkMessageWebSearchT = z.infer<typeof SdkMessageWebSearchV>;
