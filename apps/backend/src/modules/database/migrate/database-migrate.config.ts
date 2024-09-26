import { z } from 'zod';

export const DatabaseMigrateConfigV = z.object({
  checkMigrationsOnStartup: z.coerce.boolean().default(false),
});

export type DatabaseMigrateConfigT = z.infer<typeof DatabaseMigrateConfigV>;
