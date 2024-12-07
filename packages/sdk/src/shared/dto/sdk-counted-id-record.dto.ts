import { z } from 'zod';

import { SdkTableRowWithIdV } from './sdk-table-row-with-id.dto';

export const SdkCountedIdRecordV = SdkTableRowWithIdV.extend({
  count: z.number(),
});

export type SdkCountedIdRecordT = z.infer<typeof SdkCountedIdRecordV>;
