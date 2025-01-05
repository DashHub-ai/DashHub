import { z } from 'zod';

import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithIdV,
} from '~/shared';

export const SdkOrganizationUserRoleV = z.enum(['owner', 'tech', 'member']);

export type SdkOrganizationUserRoleT = z.infer<typeof SdkOrganizationUserRoleV>;

export const SdkOrganizationUserV = z.object({
  user: SdkTableRowWithIdV,
  role: SdkOrganizationUserRoleV,
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV);

export type SdkOrganizationUserT = z.infer<typeof SdkOrganizationUserV>;
