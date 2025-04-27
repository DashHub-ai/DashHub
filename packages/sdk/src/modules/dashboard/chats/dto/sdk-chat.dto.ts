import { z } from 'zod';

import {
  SdkAIGeneratedStringV,
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkTableRowWithPermissionsV } from '../../permissions/dto/sdk-table-row-with-permissions.dto';
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

export const SdkChatStatsV = z.object({
  messages: z.object({
    total: z.number(),
  }),
});

export type SdkChatStatsT = z.infer<typeof SdkChatStatsV>;

export const SdkSearchChatAppRelationV = SdkTableRowWithIdV.extend({
  aiExternalAPI: SdkTableRowWithIdV.nullable(),
});

export type SdkSearchChatAppRelationT = z.infer<typeof SdkSearchChatAppRelationV>;

export const SdkChatV = z.object({
  creator: SdkUserListItemV,
  organization: SdkIdNameUrlEntryV,
  project: SdkChatProjectV.nullable(),
  internal: z.boolean(),
  summary: SdkChatSummaryV,
  stats: SdkChatStatsV,
  apps: SdkSearchChatAppRelationV.array(),
})
  .merge(SdkTableRowWithPermissionsV)
  .merge(SdkTableRowWithUuidV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkChatT = z.infer<typeof SdkChatV>;
