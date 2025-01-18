import { z } from 'zod';

import { SdkTableRowWithIdV } from './sdk-table-row-with-id.dto';

export const SdkOptionalFileUploadV = z
  .union([z.instanceof(File), SdkTableRowWithIdV])
  .optional()
  .nullable();

export type SdkOptionalFileUploadT = z.infer<typeof SdkOptionalFileUploadV>;
