import { z } from 'zod';

export const SDK_MIN_PASSWORD_LENGTH = 8;

export const SdkCreateUserEmailAuthMethodV = z.object({
  enabled: z.boolean(),
});

export type SdkCreateUserEmailAuthMethodT = z.infer<
  typeof SdkCreateUserEmailAuthMethodV
>;

export const SdkCreateUserPasswordAuthMethodV = z.object({
  value: z.string().min(SDK_MIN_PASSWORD_LENGTH),
});

export type SdkCreateUserPasswordAuthMethodT = z.infer<
  typeof SdkCreateUserPasswordAuthMethodV
>;

export const SdkCreateUserAuthMethodsV = z.object({
  email: SdkCreateUserEmailAuthMethodV.nullable(),
  password: SdkCreateUserPasswordAuthMethodV.nullable(),
});

export type SdkCreateUserAuthMethodsT = z.infer<
  typeof SdkCreateUserAuthMethodsV
>;
