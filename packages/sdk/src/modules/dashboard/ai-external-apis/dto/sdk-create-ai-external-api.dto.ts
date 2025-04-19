import type { z } from 'zod';

import {
  SdkOptionalFileUploadV,
  SdkTableRowWithIdV,
  ZodOmitArchivedFields,
  ZodOmitDateFields,
} from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions';
import { SdkAIExternalApiV } from './sdk-ai-external-api.dto';

export const SdkCreateAIExternalAPIInputV = SdkAIExternalApiV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
})
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    organization: SdkTableRowWithIdV,
    logo: SdkOptionalFileUploadV,
  });

export type SdkCreateAIExternalAPIInputT = z.infer<typeof SdkCreateAIExternalAPIInputV>;

export const SdkCreateAIExternalAPIOutputV = SdkTableRowWithIdV;

export type SdkCreateAIExternalAPIOutputT = z.infer<typeof SdkCreateAIExternalAPIOutputV>;
