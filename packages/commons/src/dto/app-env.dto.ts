import { z } from 'zod';

export const AppEnvV = z
  .enum([
    'dev',
    'staging',
    'production',
  ])
  .default('dev');

export type AppEnvT = z.infer<typeof AppEnvV>;
