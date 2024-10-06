import { z } from 'zod';

import { SdkTableRowWithArchiveProtectionV, SdkTableRowWithIdV } from '~/shared';

import { SdkUpdateUserAuthMethodsV } from './auth';

export const SdkUpdateUserInputV = z.object({
  email: z.string(),
  active: z.boolean(),
  auth: SdkUpdateUserAuthMethodsV,
})
  .merge(SdkTableRowWithArchiveProtectionV);

export type SdkUpdateUserInputT = z.infer<typeof SdkUpdateUserInputV>;

export const SdkUpdateUserOutputV = SdkTableRowWithIdV;

export type SdkUpdateUserOutputT = z.infer<typeof SdkUpdateUserOutputV>;
