import { z } from 'zod';

import { SdkTableRowIdV } from '~/shared';

export const SdkUploadProjectFileInputV = z.object({
  projectId: SdkTableRowIdV,
  file: z.instanceof(File),
});

export type SdkUploadProjectFileInputT = z.infer<typeof SdkUploadProjectFileInputV>;
