import { z } from 'zod';

import { SdkStrictJsonV } from './sdk-strict-json.dto';
import { SdkTableRowWithIdV } from './sdk-table-row-with-id.dto';

export const SdkOptionalFileUploadV = z
  .union([
    z.instanceof(File),
    SdkTableRowWithIdV,
    SdkStrictJsonV.pipe(SdkTableRowWithIdV),
  ])
  .optional()
  .nullable();

export type SdkOptionalFileUploadT = z.infer<typeof SdkOptionalFileUploadV>;
