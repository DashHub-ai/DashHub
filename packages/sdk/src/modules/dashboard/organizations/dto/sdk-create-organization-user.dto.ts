import { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

import { SdkOrganizationUserRoleV } from './sdk-organization-user.dto';

export const SdkCreateOrganizationUserV = z.object({
  organization: SdkTableRowWithIdV,
  user: SdkTableRowWithIdV,
  role: SdkOrganizationUserRoleV,
});

export type SdkCreateOrganizationUserT = z.infer<typeof SdkCreateOrganizationUserV>;
