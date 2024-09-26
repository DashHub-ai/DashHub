import { z } from 'zod';

import {
  SdkTableRowWithArchivedV,
  SdkTableRowWithArchiveProtectionV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdV,
} from '~/shared';

import { SdkEnabledUserAuthMethodsV } from './auth';

export const SdkUserRoleV = z.enum(['root', 'user']);

export type SdkUserRoleT = z.infer<typeof SdkUserRoleV>;

export const SdkUserV = z.object({
  email: z.string(),
  active: z.boolean(),
  auth: SdkEnabledUserAuthMethodsV,
  role: SdkUserRoleV,
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV)
  .merge(SdkTableRowWithArchiveProtectionV);

export type SdkUserT = z.infer<typeof SdkUserV>;
