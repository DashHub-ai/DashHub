import { z } from 'zod';

import { SdkTableRowWithUuidV } from '~/shared';

import { SdkChatSummaryV } from './sdk-chat.dto';

export const SdkUpdateChatInputV = z.object({
  summary: SdkChatSummaryV,
});

export type SdkUpdateChatInputT = z.infer<typeof SdkUpdateChatInputV>;

export const SdkUpdateChatOutputV = SdkTableRowWithUuidV;

export type SdkUpdateChatOutputT = z.infer<typeof SdkUpdateChatOutputV>;
