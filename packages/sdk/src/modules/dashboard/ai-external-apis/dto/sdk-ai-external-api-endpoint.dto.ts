import { z } from 'zod';

import { SdkTableRowWithUuidV } from '~/shared';

import { SdkAIExternalAPIParameterV } from './sdk-ai-external-api-parameter.dto';

export const SdkAIExternalAPIEndpointV = z.object({
  path: z.string(),
  parameters: z.array(SdkAIExternalAPIParameterV),
  description: z.string(),
  functionName: z.string(),
})
  .merge(SdkTableRowWithUuidV);
