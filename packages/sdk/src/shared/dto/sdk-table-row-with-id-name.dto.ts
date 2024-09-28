import { z } from 'zod';

import { SdkTableRowIdV } from './sdk-table-row-id.dto';

export const SdkTableRowWithIdNameV = z.object({
  id: SdkTableRowIdV,
  name: z.string(),
});

export type SdkTableRowWithIdNameT = z.infer<typeof SdkTableRowWithIdNameV>;
