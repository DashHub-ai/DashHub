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

export const SdkUpdateAppInputV = SdkAppV
  .omit({
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
    category: SdkTableRowWithIdV,
    logo: SdkOptionalFileUploadV,
    aiModel: SdkTableRowWithIdV.nullable(),
    aiExternalAPI: z
      .object({
        schema: SdkAIExternalAPISchemaV,
      })
      .nullable(),
  });

export type SdkUpdateAppInputT = z.infer<typeof SdkUpdateAppInputV>;

export const SdkUpdateAppOutputV = SdkTableRowWithIdV;

export type SdkUpdateAppOutputT = z.infer<typeof SdkUpdateAppOutputV>;
