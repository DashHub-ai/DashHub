import { z } from 'zod';

import {
  SdkAIGeneratedStringInputV,
  SdkTableRowWithIdV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkChatV } from './sdk-chat.dto';

export const SdkChatSummaryInputV = z.object({
  name: SdkAIGeneratedStringInputV.optional(),
  content: SdkAIGeneratedStringInputV.optional(),
});

export type SdkChatSummaryInputT = z.infer<typeof SdkChatSummaryInputV>;

export const SdkCreateChatInputV = SdkChatV.pick({
  public: true,
  internal: true,
})
  .extend({
    creator: SdkTableRowWithIdV.optional(),
    organization: SdkTableRowWithIdV.optional(),
    summary: SdkChatSummaryInputV.optional(),
  });

export type SdkCreateChatInputT = z.infer<typeof SdkCreateChatInputV>;

export const SdkCreateChatOutputV = SdkTableRowWithUuidV;

export type SdkCreateChatOutputT = z.infer<typeof SdkCreateChatOutputV>;
