import { z } from 'zod';

import {
  SdkAIGeneratedStringV,
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

import { SdkTableRowWithPermissionsV } from '../../permissions/dto/sdk-table-row-with-permissions.dto';
import { SdkUserListItemV } from '../../users';

export const SdkProjectSummaryV = z.strictObject({
  content: SdkAIGeneratedStringV,
});

export type SdkProjectSummaryT = z.infer<typeof SdkProjectSummaryV>;

export const SdkProjectV = z.object({
  organization: SdkIdNameUrlEntryV,
  creator: SdkUserListItemV,
  summary: SdkProjectSummaryV,
})
  .merge(SdkTableRowWithPermissionsV)
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkProjectT = z.infer<typeof SdkProjectV>;
