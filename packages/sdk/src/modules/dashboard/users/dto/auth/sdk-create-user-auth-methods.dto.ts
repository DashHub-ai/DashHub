import { z } from 'zod';

import { SdkEnabledUserAuthMethodsV } from './sdk-enabled-user-auth-methods.dto';

export const SDK_MIN_PASSWORD_LENGTH = 8;

export const SdkNewPasswordV = z.string().min(SDK_MIN_PASSWORD_LENGTH);

export const SdkCreateUserAuthMethodsV = SdkEnabledUserAuthMethodsV.extend(
  {
    password: z.union([
      z.object({ enabled: z.literal(false) }),
      z.object({ enabled: z.literal(true), value: z.string() }),
    ]),
  },
);

export type SdkCreateUserAuthMethodsT = z.infer<
  typeof SdkCreateUserAuthMethodsV
>;
