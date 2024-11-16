import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@llm/commons';
import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

export const SdkAIProviderV = z.enum([
  'openai',
]);

export type SdkAIProviderT = z.infer<typeof SdkAIProviderV>;

export const SdkAICredentialsV = z.object({
  apiKey: NonEmptyOrNullStringV,
});

export type SdkAICredentialsT = z.infer<typeof SdkAICredentialsV>;

export const SdkAIModelV = z.object({
  organization: SdkIdNameUrlEntryV,
  description: NonEmptyOrNullStringV,
  provider: SdkAIProviderV,
  credentials: SdkAICredentialsV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkAIModelT = z.infer<typeof SdkAIModelV>;
