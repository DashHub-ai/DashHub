import { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

export const SdkAttachAppInputV = z.object({
  app: SdkTableRowWithIdV,
});

export type SdkAttachAppInputT = z.infer<typeof SdkAttachAppInputV>;
