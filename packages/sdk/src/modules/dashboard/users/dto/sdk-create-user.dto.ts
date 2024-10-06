import { z } from 'zod';

import { SdkTableRowWithArchiveProtectionV, SdkTableRowWithIdV } from '~/shared';

import { SdkOrganizationUserRoleV } from '../../organizations/dto/sdk-organization-user.dto';
import { SdkCreateUserAuthMethodsV } from './auth';

export const SdkCreateUserOrganizationInputV = z.object({
  item: SdkTableRowWithIdV,
  role: SdkOrganizationUserRoleV,
});

export type SdkCreateUserOrganizationInputT = z.infer<
  typeof SdkCreateUserOrganizationInputV
>;

export const SdkCreateUserInputV = z.object({
  email: z.string(),
  active: z.boolean(),
  auth: SdkCreateUserAuthMethodsV,
})
  .merge(SdkTableRowWithArchiveProtectionV)
  .and(
    z.discriminatedUnion('role', [
      z.object({
        role: z.literal('root'),
      }),
      z.object({
        role: z.literal('user'),
        organization: SdkCreateUserOrganizationInputV,
      }),
    ]),
  );

export type SdkCreateUserInputT = z.infer<typeof SdkCreateUserInputV>;

export const SdkCreateUserOutputV = SdkTableRowWithIdV;

export type SdkCreateUserOutputT = z.infer<typeof SdkCreateUserOutputV>;
