import { z } from 'zod';

import { SdkTableRowWithDatesV, SdkTableRowWithIdV } from '~/shared';

export const SdkOrganizationUserRoleV = z.enum(['owner', 'member']);

export type SdkOrganizationUserRoleT = z.infer<typeof SdkOrganizationUserRoleV>;

export const SdkOrganizationUserV = z.object({
  user: SdkTableRowWithIdV,
  role: SdkOrganizationUserRoleV,
})
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkOrganizationUserT = z.infer<typeof SdkOrganizationUserV>;
