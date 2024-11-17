import { z } from 'zod';

import { SdkTableRowUuidV } from './sdk-table-row-uuid.dto';

export const SdkUuidsArrayV = z
  .union([
    SdkTableRowUuidV,
    z.array(SdkTableRowUuidV),
  ])
  .transform(value => Array.isArray(value) ? value : [value]);

export type SdkUuidsArrayT = z.infer<typeof SdkUuidsArrayV>;
