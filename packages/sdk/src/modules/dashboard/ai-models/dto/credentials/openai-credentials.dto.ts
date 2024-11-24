import { z } from 'zod';

export const SdkOpenAICredentialsV = z.object({
  apiKey: z.string(),
  apiModel: z.string(),
});
