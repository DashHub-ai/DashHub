import { z } from 'zod';

export const SdkOpenAICredentialsV = z.object({
  apiUrl: z.string().optional(),
  apiKey: z.string(),
  apiModel: z.string(),
});
