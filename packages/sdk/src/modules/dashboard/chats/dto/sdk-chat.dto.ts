import { z } from 'zod';

import {
  SdkAIGeneratedStringV,
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkUserListItemV } from '../../users/dto/sdk-user-list-item.dto';

export const SdkChatSummaryV = z.strictObject({
  name: SdkAIGeneratedStringV,
  content: SdkAIGeneratedStringV,
});

export type SdkChatSummaryT = z.infer<typeof SdkChatSummaryV>;

export const SdkChatV = z.object({
  creator: SdkUserListItemV,
  organization: SdkIdNameUrlEntryV,
  public: z.boolean(),
  internal: z.boolean(),
  summary: SdkChatSummaryV,
})
  .merge(SdkTableRowWithUuidV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkChatT = z.infer<typeof SdkChatV>;
