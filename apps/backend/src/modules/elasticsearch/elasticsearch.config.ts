import { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';

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
    onStartup: StrictBooleanV.default(true),
    cron: z.string().optional(),
  }),
});

export type ElasticsearchConfigT = z.infer<typeof ElasticsearchConfigV>;
