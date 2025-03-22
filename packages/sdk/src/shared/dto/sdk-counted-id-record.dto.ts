import type { z } from 'zod';

import { SdkCountedRecordV } from './sdk-counted-record.dto';
import { SdkTableRowWithIdV } from './sdk-table-row-with-id.dto';

export const SdkCountedIdRecordV = SdkTableRowWithIdV.merge(SdkCountedRecordV);

export type SdkCountedIdRecordT = z.infer<typeof SdkCountedIdRecordV>;
