import { z } from 'zod';

import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkUserListItemV } from '../../users/dto/sdk-user-list-item.dto';
import { SdkMessageAsyncFunctionResultV } from './sdk-message-async-function-result.dto';
import { SdkMessageFileV } from './sdk-message-file.dto';
import { SdkMessageWebSearchV } from './sdk-message-websearch.dto';

export const SdkMessageRoleV = z.enum(['user', 'assistant', 'system']);

export type SdkMessageRoleT = z.infer<typeof SdkMessageRoleV>;

export const SdkRepliedMessageV = z
  .object({
    role: SdkMessageRoleV,
    content: z.string(),
    creator: SdkUserListItemV.nullable(),
  })
  .merge(SdkTableRowWithUuidV);

export type SdkRepliedMessageT = z.infer<typeof SdkRepliedMessageV>;

export const SdkMessageV = z
  .object({
    content: z.string(),
    role: SdkMessageRoleV,
    chat: SdkTableRowWithUuidV.extend({
      creator: SdkUserListItemV,
    }),
    creator: SdkUserListItemV.nullable(),
    aiModel: SdkTableRowWithIdNameV.nullable(),
    app: SdkTableRowWithIdNameV.nullable(),
    repliedMessage: SdkRepliedMessageV.nullable(),
    files: z.array(SdkMessageFileV),
    corrupted: z.boolean(),
    webSearch: SdkMessageWebSearchV,
    asyncFunctionsResults: z.array(SdkMessageAsyncFunctionResultV),
  })
  .merge(SdkTableRowWithUuidV)
  .merge(SdkTableRowWithDatesV);

export type SdkMessageT = z.infer<typeof SdkMessageV>;
