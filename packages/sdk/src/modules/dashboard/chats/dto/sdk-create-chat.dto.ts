import { z } from 'zod';

import {
  SdkAIGeneratedStringInputV,
  SdkTableRowWithIdV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { type SdkChatSummaryT, SdkChatV } from './sdk-chat.dto';

export const SdkChatSummaryInputV = z.object({
  name: SdkAIGeneratedStringInputV.optional(),
  content: SdkAIGeneratedStringInputV.optional(),
});

export type SdkChatSummaryInputT = z.infer<typeof SdkChatSummaryInputV>;

export const SdkCreateChatInputV = SdkChatV.pick({
  internal: true,
  project: true,
  permissions: true,
})
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    creator: SdkTableRowWithIdV.optional(),
    project: SdkTableRowWithIdV.optional().nullable(),
    organization: SdkTableRowWithIdV.optional(),
    summary: SdkChatSummaryInputV.optional(),
  });

export type SdkCreateChatInputT = z.infer<typeof SdkCreateChatInputV>;

export const SdkCreateChatOutputV = SdkTableRowWithUuidV;

export type SdkCreateChatOutputT = z.infer<typeof SdkCreateChatOutputV>;

export function castSdkChatSummaryToUpdateInput(summary: SdkChatSummaryT): SdkChatSummaryInputT {
  return {
    name: summary.name.generated
      ? { generated: true, value: null }
      : { generated: false, value: summary.name.value || '' },

    content: summary.content.generated
      ? { generated: true, value: null }
      : { generated: false, value: summary.content.value || '' },
  };
}
