import { z } from 'zod';

export const DatabaseConfigV = z.object({
  hostname: z.string().default('0.0.0.0'),
  port: z.coerce.number().default(5432),
  name: z.string(),
  user: z.string(),
  password: z.string(),
});

export type DatabaseConfigT = z.infer<typeof DatabaseConfigV>;
