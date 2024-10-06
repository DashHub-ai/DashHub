import { z } from 'zod';

import { SdkTableRowIdV } from './sdk-table-row-id.dto';

export const SdkIdsArrayV = z
  .union([
    SdkTableRowIdV,
    z.array(SdkTableRowIdV),
  ])
  .transform(value => Array.isArray(value) ? value : [value]);

export type SdkIdsArrayT = z.infer<typeof SdkIdsArrayV>;
