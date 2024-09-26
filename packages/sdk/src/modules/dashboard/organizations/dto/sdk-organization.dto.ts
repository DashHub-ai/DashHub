import { z } from 'zod';

import {
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdV,
} from '~/shared';

export const SdkOrganizationV = z.object({
  name: z.string(),
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkOrganizationT = z.infer<typeof SdkOrganizationV>;
