import { z } from 'zod';

export const SdkSearchEngineCredentialsV = z.object({
  apiKey: z.string(),
});

export type SdkSearchEngineCredentialsT = z.infer<typeof SdkSearchEngineCredentialsV>;
