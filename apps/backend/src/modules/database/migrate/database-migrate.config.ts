import { z } from 'zod';

import { StrictBooleanV } from '@llm/commons';

export const DatabaseMigrateConfigV = z.object({
  checkMigrationsOnStartup: StrictBooleanV.default(false),
});

export type DatabaseMigrateConfigT = z.infer<typeof DatabaseMigrateConfigV>;
