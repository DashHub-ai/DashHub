import { z } from 'zod';

import { SdkTableRowIdV } from './sdk-table-row-id.dto';

export const SdkTableRowWithUuidNameV = z.object({
  id: SdkTableRowIdV,
  name: z.string(),
});

export type SdkTableRowWithUuidNameT = z.infer<typeof SdkTableRowWithUuidNameV>;
