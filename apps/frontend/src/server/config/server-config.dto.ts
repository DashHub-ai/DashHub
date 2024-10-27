import { z } from 'zod';

import { AppEnvV } from '@llm/commons';

export const ServerConfigV = z.object({
  env: AppEnvV,
  basicAuth: z.object({
    username: z.string(),
    password: z.string(),
  }).optional(),
});

export type ServerConfigT = z.infer<typeof ServerConfigV>;
