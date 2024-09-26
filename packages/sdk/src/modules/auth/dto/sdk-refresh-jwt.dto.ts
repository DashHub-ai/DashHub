import { z } from 'zod';

import { SdkPasswordLoginOutputV } from './sdk-password-login.dto';

export const SdkRefreshJWTInputV = z.object({
  refreshToken: z.string(),
});

export type SdkRefreshJWTInputT = z.infer<typeof SdkRefreshJWTInputV>;

export const SdkRefreshTokenOutputV = SdkPasswordLoginOutputV;

export type SdkRefreshTokenOutputT = z.infer<typeof SdkPasswordLoginOutputV>;
