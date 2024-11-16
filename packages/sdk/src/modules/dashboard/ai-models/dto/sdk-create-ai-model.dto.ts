import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkAIModelV } from './sdk-ai-model.dto';

export const SdkCreateAIModelInputV = SdkAIModelV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
})
  .extend({
    organization: SdkTableRowWithIdV,
  });

export type SdkCreateAIModelInputT = z.infer<typeof SdkCreateAIModelInputV>;

export const SdkCreateAIModelOutputV = SdkTableRowWithIdV;

export type SdkCreateAIModelOutputT = z.infer<typeof SdkCreateAIModelOutputV>;
