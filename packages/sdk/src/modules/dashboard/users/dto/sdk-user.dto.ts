import { z } from 'zod';

import {
  SdkTableRowWithArchivedV,
  SdkTableRowWithArchiveProtectionV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdV,
} from '~/shared';

import { SdkOrganizationUserV } from '../../organizations/dto/sdk-organization-user.dto';
import { SdkEnabledUserAuthMethodsV } from './auth';

export const SdkUserRoleV = z.enum(['root', 'user']);

export type SdkUserRoleT = z.infer<typeof SdkUserRoleV>;

export const SdkUserV = z.object({
  email: z.string(),
  name: z.string(),
  active: z.boolean(),
  auth: SdkEnabledUserAuthMethodsV,
  role: SdkUserRoleV,
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV)
  .merge(SdkTableRowWithArchiveProtectionV)
  .and(
    z.discriminatedUnion('role', [
      z.object({
        role: z.literal('root'),
      }),
      z.object({
        role: z.literal('user'),
        organization: SdkOrganizationUserV.omit({
          user: true,
        }),
      }),
    ]),
  );

export type SdkUserT = z.infer<typeof SdkUserV>;

export type SdkExtractUserT<R extends SdkUserRoleT> = Extract<SdkUserT, { role: R; }>;
