import { z } from 'zod';

export const SdkCreateUserAuthMethodsV = z.record(
  z.enum(['password', 'email']),
  z.object({
    value: z.string(),
  }),
);

export type SdkCreateUserAuthMethodsT = z.infer<
  typeof SdkCreateUserAuthMethodsV
>;
