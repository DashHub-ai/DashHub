import { z } from 'zod';

import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithIdV,
} from '~/shared';

const SDK_ORGANIZATION_USER_ROLES = ['owner', 'tech', 'member'] as const;

export const SdkOrganizationUserRoleV = z.enum(SDK_ORGANIZATION_USER_ROLES);

export type SdkOrganizationUserRoleT = z.infer<typeof SdkOrganizationUserRoleV>;

export const SdkOrganizationUserV = z.object({
  user: SdkTableRowWithIdV,
  role: SdkOrganizationUserRoleV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV);

export type SdkOrganizationUserT = z.infer<typeof SdkOrganizationUserV>;

export function isTechOrOwnerUserSdkOrganizationRole(role: SdkOrganizationUserRoleT): boolean {
  return role === 'tech' || role === 'owner';
}

export function compareSdkOrganizationUserRoles(
  roleA: SdkOrganizationUserRoleT,
  roleB: SdkOrganizationUserRoleT,
): 0 | 1 | -1 {
  const indexA = SDK_ORGANIZATION_USER_ROLES.indexOf(roleA);
  const indexB = SDK_ORGANIZATION_USER_ROLES.indexOf(roleB);

  if (indexA === indexB) {
    return 0;
  }

  return indexA > indexB ? 1 : -1;
}
