import { z } from 'zod';

import { SdkTableRowUuidV } from './sdk-table-row-uuid.dto';

export const SdkTableRowWithUuidV = z.object({
  id: SdkTableRowUuidV,
});

export type SdkTableRowWithUuidT = z.infer<typeof SdkTableRowWithUuidV>;
