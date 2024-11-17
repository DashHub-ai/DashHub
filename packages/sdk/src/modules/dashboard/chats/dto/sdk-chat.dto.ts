import { z } from 'zod';

import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithUuidV,
} from '~/shared';

const SdkGeneratedStringV = z.object({
  value: z.string(),
  generated: z.boolean(),
});

export const SdkChatSummaryV = z.object({
  name: SdkGeneratedStringV,
  content: SdkGeneratedStringV,
});

export type SdkChatSummaryT = z.infer<typeof SdkChatSummaryV>;

export const SdkChatV = z.object({
  creator: SdkIdNameUrlEntryV,
  organization: SdkIdNameUrlEntryV,
  public: z.boolean(),
  summary: SdkChatSummaryV.nullable(),
})
  .merge(SdkTableRowWithUuidV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkChatT = z.infer<typeof SdkChatV>;
