import { z } from 'zod';

import { SdkAIExternalAPIEndpointV } from './sdk-ai-external-api-endpoint.dto';
import { SdkAIExternalAPIParameterV } from './sdk-ai-external-api-parameter.dto';

export const SdkAIExternalAPISchemaV = z.object({
  apiUrl: z.string(),
  endpoints: z.array(SdkAIExternalAPIEndpointV),
  parameters: z.array(SdkAIExternalAPIParameterV),
});

export type SdkAIExternalAPISchemaT = z.infer<typeof SdkAIExternalAPISchemaV>;
