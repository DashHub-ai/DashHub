import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithUuidV } from '~/shared';

import { SdkUserListItemV } from '../../users/dto/sdk-user-list-item.dto';

export const SdkMessageRoleV = z.enum(['user', 'assistant', 'system']);

export type SdkMessageRoleT = z.infer<typeof SdkMessageRoleV>;

export const SdkRepeatedMessageV = z.object({
  content: z.string(),
  repeatCount: z.number(),
})
  .merge(SdkTableRowWithUuidV)
  .merge(SdkTableRowWithDatesV);

export type SdkRepeatedMessageT = z.infer<typeof SdkRepeatedMessageV>;

export const SdkMessageV = z.object({
  content: z.string(),
  role: SdkMessageRoleV,
  repeats: z.array(SdkRepeatedMessageV),
  creator: SdkUserListItemV.nullable(),
})
  .merge(SdkTableRowWithUuidV)
  .merge(SdkTableRowWithDatesV);

export type SdkMessageT = z.infer<typeof SdkMessageV>;
