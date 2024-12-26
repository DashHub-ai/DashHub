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

export const SdkChatProjectV = z
  .object({
    internal: z.boolean(),
  })
  .and(SdkIdNameUrlEntryV);

export type SdkChatProjectT = z.infer<typeof SdkChatProjectV>;

export const SdkChatV = z.object({
  creator: SdkUserListItemV,
  organization: SdkIdNameUrlEntryV,
  project: SdkChatProjectV.nullable(),
  public: z.boolean(),
  internal: z.boolean(),
  summary: SdkChatSummaryV,
})
  .merge(SdkTableRowWithUuidV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkChatT = z.infer<typeof SdkChatV>;
