import { z } from 'zod';

export const ChatsSummariesConfigV = z.object({
  cron: z.string().default('*/20 * * * * *'),
});

export type ChatsSummariesConfigT = z.infer<typeof ChatsSummariesConfigV>;
