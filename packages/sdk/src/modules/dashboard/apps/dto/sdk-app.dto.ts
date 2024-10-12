import { z } from 'zod';

import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkAppV = z.object({
  organization: SdkIdNameUrlEntryV,
  chatContext: z.string(),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkAppT = z.infer<typeof SdkAppV>;
