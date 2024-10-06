import { z } from 'zod';

import { SdkTableRowIdV } from './sdk-table-row-id.dto';

export const SdkIdsArrayV = z.array(SdkTableRowIdV);

export type SdkIdsArrayT = z.infer<typeof SdkIdsArrayV>;
