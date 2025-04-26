import { z } from 'zod';

import {
  SdkOptionalFileUploadV,
  SdkTableRowWithIdV,
  ZodOmitArchivedFields,
  ZodOmitDateFields,
} from '~/shared';

import { SdkAIExternalAPISchemaV } from '../../ai-external-apis';
import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions/dto/sdk-upsert-table-row-with-permissions.dto';
import { SdkAppV } from './sdk-app.dto';

export const SdkCreateAppInputV = SdkAppV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
  project: true,
  category: true,
  aiModel: true,
  aiExternalAPI: true,
  recentChats: true,
})
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    organization: SdkTableRowWithIdV,
    category: SdkTableRowWithIdV,
    logo: SdkOptionalFileUploadV,
    aiModel: SdkTableRowWithIdV.nullable(),
    aiExternalAPI: z
      .object({
        schema: SdkAIExternalAPISchemaV,
      })
      .nullable(),
  });

export type SdkCreateAppInputT = z.infer<typeof SdkCreateAppInputV>;

export const SdkCreateAppOutputV = SdkTableRowWithIdV;

export type SdkCreateAppOutputT = z.infer<typeof SdkCreateAppOutputV>;
