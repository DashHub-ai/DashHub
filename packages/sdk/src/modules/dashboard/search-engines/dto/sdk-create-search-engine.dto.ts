import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkSearchEngineV } from './sdk-search-engine.dto';

export const SdkCreateSearchEngineInputV = SdkSearchEngineV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
})
  .extend({
    organization: SdkTableRowWithIdV,
  });

export type SdkCreateSearchEngineInputT = z.infer<typeof SdkCreateSearchEngineInputV>;

export const SdkCreateSearchEngineOutputV = SdkTableRowWithIdV;

export type SdkCreateSearchEngineOutputT = z.infer<typeof SdkCreateSearchEngineOutputV>;
