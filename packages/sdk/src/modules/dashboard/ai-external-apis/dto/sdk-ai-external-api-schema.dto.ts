import { z } from 'zod';

import { NonEmptyOrNullStringV } from '@dashhub/commons';

import { SdkAIExternalAPIEndpointV } from './sdk-ai-external-api-endpoint.dto';
import { SdkAIExternalAPIParameterV } from './sdk-ai-external-api-parameter.dto';

export const SdkAIExternalAPISchemaV = z.object({
  apiUrl: NonEmptyOrNullStringV,
  endpoints: z.array(SdkAIExternalAPIEndpointV),
  parameters: z.array(SdkAIExternalAPIParameterV),
});

export type SdkAIExternalAPISchemaT = z.infer<typeof SdkAIExternalAPISchemaV>;
