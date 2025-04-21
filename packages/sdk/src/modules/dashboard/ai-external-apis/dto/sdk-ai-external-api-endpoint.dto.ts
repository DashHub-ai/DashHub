import { z } from 'zod';

import { SdkTableRowWithUuidV } from '~/shared';

import { SdkAIExternalAPIParameterV } from './sdk-ai-external-api-parameter.dto';

export const SDK_AI_EXTERNAL_API_ENDPOINT_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
] as const;

export const SdkAIExternalAPIEndpointMethodV = z.enum(SDK_AI_EXTERNAL_API_ENDPOINT_METHODS);

export type SdkAIExternalAPIEndpointMethodT = z.infer<typeof SdkAIExternalAPIEndpointMethodV>;

export const SdkAIExternalAPIEndpointV = z.object({
  method: SdkAIExternalAPIEndpointMethodV,
  path: z.string(),
  parameters: z.array(SdkAIExternalAPIParameterV),
  description: z.string(),
  functionName: z.string(),
})
  .merge(SdkTableRowWithUuidV);

export type SdkAIExternalAPIEndpointT = z.infer<typeof SdkAIExternalAPIEndpointV>;
