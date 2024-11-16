import { z } from 'zod';

import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdV,
  SdkTimestampV,
} from '~/shared';

export const SdkChatSummaryV = z.object({
  content: z.string(),
});

export type SdkChatSummaryT = z.infer<typeof SdkChatSummaryV>;

export const SdkChatV = z.object({
  creator: SdkIdNameUrlEntryV,
  organization: SdkIdNameUrlEntryV,
  lastMessageAt: SdkTimestampV,
  public: z.boolean(),
  summary: SdkChatSummaryV.nullable(),
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkChatT = z.infer<typeof SdkChatV>;