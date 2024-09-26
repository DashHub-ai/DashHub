import { z } from 'zod';

export const HttpServerConfigV = z.object({
  hostname: z.string().default('0.0.0.0'),
  port: z.coerce.number().default(3000),
});

export type HttpServerConfigT = z.infer<typeof HttpServerConfigV>;
