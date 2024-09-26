import { z } from 'zod';

export const SdkEnabledUserAuthMethodsV = z.record(
  z.enum(['password', 'email']),
  z.object({
    enabled: z.boolean(),
  }),
);

export type SdkEnabledUserAuthMethodsT = z.infer<
  typeof SdkEnabledUserAuthMethodsV
>;
