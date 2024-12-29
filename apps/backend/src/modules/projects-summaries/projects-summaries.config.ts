import { z } from 'zod';

export const ProjectsSummariesConfigV = z.object({
  cron: z.string().default('*/20 * * * * *'),
});

export type ProjectsSummariesConfigT = z.infer<typeof ProjectsSummariesConfigV>;
