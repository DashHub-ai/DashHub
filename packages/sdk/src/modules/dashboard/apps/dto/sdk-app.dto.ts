import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@llm/commons';
import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

import { SdkTableRowWithPermissionsV } from '../../permissions/dto/sdk-table-row-with-permissions.dto';

export const SdkAppV = z.strictObject({
  organization: SdkIdNameUrlEntryV,
  chatContext: z.string(),
  description: NonEmptyOrNullStringV,
  category: SdkTableRowWithIdNameV,
})
  .merge(SdkTableRowWithPermissionsV)
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkAppT = z.infer<typeof SdkAppV>;
