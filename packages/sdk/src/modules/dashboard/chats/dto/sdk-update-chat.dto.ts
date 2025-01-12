import { z } from 'zod';

import { type SdkTableRowWithUuidT, SdkTableRowWithUuidV } from '~/shared';

import type { SdkChatT } from './sdk-chat.dto';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { castSdkChatSummaryToUpdateInput, SdkChatSummaryInputV } from './sdk-create-chat.dto';

export const SdkUpdateChatInputV = z
  .object({
    summary: SdkChatSummaryInputV,
  })
  .merge(SdkUpsertTableRowWithPermissionsInputV);

export type SdkUpdateChatInputT = z.infer<typeof SdkUpdateChatInputV>;

export const SdkUpdateChatOutputV = SdkTableRowWithUuidV;

export type SdkUpdateChatOutputT = z.infer<typeof SdkUpdateChatOutputV>;

export function castSdkChatToUpdateInput(chat: SdkChatT): SdkUpdateChatInputT & SdkTableRowWithUuidT {
  return {
    ...chat,
    permissions: chat.permissions?.current,
    summary: castSdkChatSummaryToUpdateInput(chat.summary),
  };
}
