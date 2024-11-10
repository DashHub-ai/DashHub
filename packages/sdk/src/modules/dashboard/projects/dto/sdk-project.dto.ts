import { z } from 'zod';

import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkProjectV = z.object({
  organization: SdkIdNameUrlEntryV,
  description: z.string(),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkProjectT = z.infer<typeof SdkProjectV>;
