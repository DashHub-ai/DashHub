import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@llm/commons';
import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

import { SdkOpenAICredentialsV } from './credentials';

export const SDK_AI_PROVIDERS = ['openai'] as const;

export const SdkAIProviderV = z.enum(SDK_AI_PROVIDERS);

export type SdkAIProviderT = z.infer<typeof SdkAIProviderV>;

export const SdkAICredentialsV = SdkOpenAICredentialsV;

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
