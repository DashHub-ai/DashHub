import { z } from 'zod';

import { AppEnvV } from '@llm/commons';

export const ConfigV = z.object({
  env: AppEnvV,
  apiUrl: z.string(),
});

export type ConfigT = z.infer<typeof ConfigV>;
