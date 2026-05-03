import { z } from 'zod';

export const SdkOpenAICredentialsV = z.object({
  apiUrl: z.string().optional(),
  apiKey: z.string().optional().default(''),
  apiModel: z.string(),
});
