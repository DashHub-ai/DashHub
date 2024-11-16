import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkAIModelV } from './sdk-ai-model.dto';

export const SdkUpdateAIModelInputV = SdkAIModelV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
});

export type SdkUpdateAIModelInputT = z.infer<typeof SdkUpdateAIModelInputV>;

export const SdkUpdateAIModelOutputV = SdkTableRowWithIdV;

export type SdkUpdateAIModelOutputT = z.infer<typeof SdkUpdateAIModelOutputV>;
