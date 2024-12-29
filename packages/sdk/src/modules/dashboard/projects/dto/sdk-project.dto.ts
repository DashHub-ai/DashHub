import { z } from 'zod';

import {
  SdkAIGeneratedStringV,
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkProjectSummaryV = z.strictObject({
  content: SdkAIGeneratedStringV,
});

export type SdkProjectSummaryT = z.infer<typeof SdkProjectSummaryV>;

export const SdkProjectV = z.object({
  organization: SdkIdNameUrlEntryV,
  summary: SdkProjectSummaryV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkProjectT = z.infer<typeof SdkProjectV>;
