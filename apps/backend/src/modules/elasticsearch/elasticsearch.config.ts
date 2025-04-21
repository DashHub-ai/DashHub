import { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';

export const ElasticsearchConfigV = z.object({
  noLogs: StrictBooleanV.default(false),
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
    cron: z.string().default('1 0 * * *'),
  }),
});

export type ElasticsearchConfigT = z.infer<typeof ElasticsearchConfigV>;
