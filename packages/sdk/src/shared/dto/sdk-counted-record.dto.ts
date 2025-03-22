import { z } from 'zod';

export const SdkCountedRecordV = z.object({
  count: z.number(),
});

export type SdkCountedRecordT = z.infer<typeof SdkCountedRecordV>;
