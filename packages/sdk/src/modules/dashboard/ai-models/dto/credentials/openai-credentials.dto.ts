import { z } from 'zod';

export const SdkOpenAICredentialsV = z.object({
  apiKey: z.string(),
  organization: z.string(),
});
