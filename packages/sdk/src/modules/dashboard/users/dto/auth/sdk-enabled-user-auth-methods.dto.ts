import { z } from 'zod';

export const SdkIsAuthMethodEnabledV = z.object({
  enabled: z.boolean(),
});

export const SdkEnabledUserAuthMethodsV = z.object({
  password: SdkIsAuthMethodEnabledV,
  email: SdkIsAuthMethodEnabledV,
});

export type SdkEnabledUserAuthMethodsT = z.infer<
  typeof SdkEnabledUserAuthMethodsV
>;
