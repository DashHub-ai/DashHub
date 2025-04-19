import type { z } from 'zod';

import {
  SdkOptionalFileUploadV,
  SdkTableRowWithIdV,
  ZodOmitArchivedFields,
  ZodOmitDateFields,
} from '~/shared';

import { SdkUpsertTableRowWithPermissionsInputV } from '../../permissions';
import { SdkAIExternalApiV } from './sdk-ai-external-api.dto';

export const SdkUpdateAIExternalAPIInputV = SdkAIExternalApiV
  .omit({
    ...ZodOmitDateFields,
    ...ZodOmitArchivedFields,
    id: true,
    organization: true,
  })
  .merge(SdkUpsertTableRowWithPermissionsInputV)
  .extend({
    logo: SdkOptionalFileUploadV,
  });

export type SdkUpdateAIExternalAPIInputT = z.infer<typeof SdkUpdateAIExternalAPIInputV>;

export const SdkUpdateAIExternalAPIOutputV = SdkTableRowWithIdV;

export type SdkUpdateAIExternalAPIOutputT = z.infer<typeof SdkUpdateAIExternalAPIOutputV>;
