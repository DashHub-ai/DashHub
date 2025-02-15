import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@llm/commons';
import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SDK_SEARCH_ENGINE_PROVIDERS = ['sarper'] as const;

export const SdkSearchEngineProviderV = z.enum(SDK_SEARCH_ENGINE_PROVIDERS);

export type SdkSearchEngineProviderT = z.infer<typeof SdkSearchEngineProviderV>;

export const SdkSearchEngineV = z.object({
  organization: SdkIdNameUrlEntryV,
  description: NonEmptyOrNullStringV,
  provider: SdkSearchEngineProviderV,
  credentials: z.record(z.string(), z.any()),
  default: z.boolean(),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkSearchEngineT = z.infer<typeof SdkSearchEngineV>;
