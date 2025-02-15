import type { z } from 'zod';

import { SdkTableRowWithIdV, ZodOmitArchivedFields, ZodOmitDateFields } from '~/shared';

import { SdkSearchEngineV } from './sdk-search-engine.dto';

export const SdkUpdateSearchEngineInputV = SdkSearchEngineV.omit({
  ...ZodOmitDateFields,
  ...ZodOmitArchivedFields,
  id: true,
  organization: true,
});

export type SdkUpdateSearchEngineInputT = z.infer<typeof SdkUpdateSearchEngineInputV>;

export const SdkUpdateSearchEngineOutputV = SdkTableRowWithIdV;

export type SdkUpdateSearchEngineOutputT = z.infer<typeof SdkUpdateSearchEngineOutputV>;
