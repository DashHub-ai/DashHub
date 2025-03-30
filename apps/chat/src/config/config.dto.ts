import { z } from 'zod';

import { AppEnvV } from '@llm/commons';

export const ConfigV = z.object({
  env: AppEnvV,
  apiUrl: z.string(),
  googleDrive: z.object({
    clientId: z.string(),
  }).optional(),
});

export type ConfigT = z.infer<typeof ConfigV>;
