import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@dashhub/commons';
import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkExpertV = z.strictObject({
  organization: SdkIdNameUrlEntryV,
  aiModels: z.array(SdkIdNameUrlEntryV),
  description: NonEmptyOrNullStringV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkExpertT = z.infer<typeof SdkExpertV>;
