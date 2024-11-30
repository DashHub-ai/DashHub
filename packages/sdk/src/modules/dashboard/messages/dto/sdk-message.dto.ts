import { z } from 'zod';

import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkUserListItemV } from '../../users/dto/sdk-user-list-item.dto';

export const SdkMessageRoleV = z.enum(['user', 'assistant', 'system']);

export type SdkMessageRoleT = z.infer<typeof SdkMessageRoleV>;

export const SdkMessageV = z.object({
  content: z.string(),
  role: SdkMessageRoleV,
  creator: SdkUserListItemV.nullable(),
  aiModel: SdkTableRowWithIdNameV.nullable(),
  repliedMessage: SdkTableRowWithUuidV.nullable(),
})
  .merge(SdkTableRowWithUuidV)
  .merge(SdkTableRowWithDatesV);

export type SdkMessageT = z.infer<typeof SdkMessageV>;
