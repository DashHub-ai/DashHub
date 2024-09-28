import { z } from 'zod';

import { SdkTableRowWithIdV } from '~/shared';

import { SdkOrganizationUserRoleV } from '../../organizations/dto/sdk-organization-user.dto';
import { SdkCreateUserAuthMethodsV } from './auth';

export const SdkCreateUserInputV = z.object({
  email: z.string(),
  active: z.boolean(),
  auth: SdkCreateUserAuthMethodsV,
})
  .and(
    z.discriminatedUnion('role', [
      z.object({
        role: z.literal('root'),
      }),
      z.object({
        role: z.literal('user'),
        organization: SdkTableRowWithIdV.extend({
          role: SdkOrganizationUserRoleV,
        }),
      }),
    ]),
  );

export type SdkCreateUserInputT = z.infer<typeof SdkCreateUserInputV>;
