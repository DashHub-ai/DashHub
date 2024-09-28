import { z } from 'zod';

import { SdkJwtTokensPairV } from './sdk-jwt-tokens-pair.dto';
import { SdkJwtTokenV } from './sdk-jwt.dto';

export const SdkPasswordLoginInputV = z.object({
  email: z.string(),
  password: z.string(),
  remember: z.boolean().optional(),
});

export type SdkPasswordLoginInputT = z.infer<typeof SdkPasswordLoginInputV>;

export const SdkPasswordLoginOutputV = z
  .object({
    decoded: SdkJwtTokenV,
  })
  .merge(SdkJwtTokensPairV);

export type SdkPasswordLoginOutputT = z.infer<typeof SdkPasswordLoginOutputV>;
