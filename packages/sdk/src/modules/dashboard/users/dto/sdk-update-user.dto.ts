import { z } from 'zod';

import { SdkTableRowWithArchiveProtectionV, SdkTableRowWithIdV } from '~/shared';

import { SdkOrganizationUserRoleV } from '../../organizations/dto/sdk-organization-user.dto';
import { SdkUpdateUserAuthMethodsV } from './auth';

export const SdkUpdateUserOrganizationInputV = z.object({
  role: SdkOrganizationUserRoleV,
});

export type SdkUpdateUserOrganizationInputT = z.infer<
  typeof SdkUpdateUserOrganizationInputV
>;

export const SdkUpdateUserInputV = z.object({
  email: z.string(),
  name: z.string(),
  active: z.boolean(),
  auth: SdkUpdateUserAuthMethodsV,
})
  .merge(SdkTableRowWithArchiveProtectionV)
  .and(
    z.discriminatedUnion('role', [
      z.object({
        role: z.literal('root'),
      }),
      z.object({
        role: z.literal('user'),
        organization: SdkUpdateUserOrganizationInputV,
      }),
    ]),
  );

export type SdkUpdateUserInputT = z.infer<typeof SdkUpdateUserInputV>;

export const SdkUpdateUserOutputV = SdkTableRowWithIdV;

export type SdkUpdateUserOutputT = z.infer<typeof SdkUpdateUserOutputV>;
