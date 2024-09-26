import { z } from 'zod';

export const ElasticsearchConfigV = z.object({
  hostname: z.string().default('0.0.0.0'),
  port: z.coerce.number().default(9200),
  auth: (
    z
      .object({
        user: z.string(),
        password: z.string(),
      })
      .optional()
  ),

  syncMappings: z.object({
    onStartup: z.coerce.boolean().default(true),
    cron: z.string().optional(),
  }),
});

export type ElasticsearchConfigT = z.infer<typeof ElasticsearchConfigV>;
