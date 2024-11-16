import type { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

import { SdkChatV } from './sdk-chat.dto';

export const SdkCreateChatInputV = SdkChatV.pick({
  public: true,
})
  .extend({
    creator: SdkTableRowWithIdV.optional(),
    organization: SdkTableRowWithIdV.optional(),
  });

export type SdkCreateChatInputT = z.infer<typeof SdkCreateChatInputV>;

export const SdkCreateChatOutputV = SdkTableRowWithIdV;

export type SdkCreateChatOutputT = z.infer<typeof SdkCreateChatOutputV>;
