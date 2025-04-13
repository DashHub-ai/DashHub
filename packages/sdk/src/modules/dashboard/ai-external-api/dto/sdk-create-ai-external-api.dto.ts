import type { z } from 'zod';

import {
  SdkOptionalFileUploadV,
  SdkTableRowWithIdV,
  ZodOmitArchivedFields,
  ZodOmitDateFields,
} from '~/shared';

import { SdkAIExternalApiV } from './sdk-ai-external-api.dto';

export const SdkCreateAIExternalAPIInputV = SdkAIExternalApiV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
})
  .extend({
    organization: SdkTableRowWithIdV,
    logo: SdkOptionalFileUploadV,
  });

export type SdkCreateAIExternalAPIInputT = z.infer<typeof SdkCreateAIExternalAPIInputV>;

export const SdkCreateAIExternalAIOutputV = SdkTableRowWithIdV;

export type SdkCreateAIExternalAIOutputT = z.infer<typeof SdkCreateAIExternalAIOutputV>;
