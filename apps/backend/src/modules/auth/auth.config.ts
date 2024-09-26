import { z } from 'zod';

export const AuthConfigV = z.object({
  jwt: z.object({
    secret: z.string(),
    expiresIn: z.coerce.number().default(3600),
  }),
});

export type AuthConfigT = z.infer<typeof AuthConfigV>;
