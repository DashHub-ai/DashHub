import { z } from 'zod';

import { SdkTableRowIdV } from './sdk-table-row-id.dto';

export const SdkTableRowWithIdV = z.object({
  id: SdkTableRowIdV,
});

export type SdkTableRowWithIdT = z.infer<typeof SdkTableRowWithIdV>;
