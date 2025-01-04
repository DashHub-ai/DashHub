import { z } from 'zod';

import { SdkTableRowWithUuidV } from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { SdkChatSummaryInputV } from './sdk-create-chat.dto';

export const SdkUpdateChatInputV = z
  .object({
    summary: SdkChatSummaryInputV,
  })
  .merge(SdkUpsertTableRowWithPermissionsInputV);

export type SdkUpdateChatInputT = z.infer<typeof SdkUpdateChatInputV>;

export const SdkUpdateChatOutputV = SdkTableRowWithUuidV;

export type SdkUpdateChatOutputT = z.infer<typeof SdkUpdateChatOutputV>;
