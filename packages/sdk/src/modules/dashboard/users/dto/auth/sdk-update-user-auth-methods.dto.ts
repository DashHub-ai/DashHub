import { z } from 'zod';

import { SdkNewPasswordV } from './sdk-create-user-auth-methods.dto';
import { SdkEnabledUserAuthMethodsV, SdkIsAuthMethodEnabledV } from './sdk-enabled-user-auth-methods.dto';

export const SdkUpdateUserAuthMethodsV = SdkEnabledUserAuthMethodsV.extend(
  {
    password: z
      .object({
        enabled: z.literal(true),
        value: SdkNewPasswordV.optional(),
      })
      .or(SdkIsAuthMethodEnabledV),
  },
);

export type SdkUpdateUserAuthMethodsT = z.infer<
  typeof SdkUpdateUserAuthMethodsV
>;
