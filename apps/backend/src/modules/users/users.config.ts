import { z } from 'zod';

export const UsersConfigV = z.object({
  root: z.object({
    email: z.string().default('root@localhost'),
    password: z.string().optional(),
  }),
});

export type UsersConfigT = z.infer<typeof UsersConfigV>;
