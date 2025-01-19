import { z } from 'zod';

import { SdkTableRowUuidV } from './sdk-table-row-uuid.dto';

export const SdkTableRowWithUuidNameV = z.object({
  id: SdkTableRowUuidV,
  name: z.string(),
});

export type SdkTableRowWithUuidNameT = z.infer<typeof SdkTableRowWithUuidNameV>;
