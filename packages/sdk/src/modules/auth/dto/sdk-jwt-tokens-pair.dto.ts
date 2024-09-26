import { z } from 'zod';

export const SdkJwtTokensPairV = z.object({
  token: z.string(),
  refreshToken: z.string(),
});

export type SdkJwtTokensPairT = z.infer<typeof SdkJwtTokensPairV>;
