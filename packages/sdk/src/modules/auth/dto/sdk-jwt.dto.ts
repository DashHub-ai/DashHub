import { z } from 'zod';

import { SdkOrganizationUserRoleV } from '~/modules/dashboard/organizations';

export const SdkJwtUserOrganizationV = z.object({
  id: z.coerce.number(),
  name: z.string(),
  role: SdkOrganizationUserRoleV,
});

export type SdkJwtUserOrganizationT = z.infer<typeof SdkJwtUserOrganizationV>;

export const SdkJwtTokenRoleSpecificV = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('root'),
  }),
  z.object({
    role: z.literal('user'),
    organization: SdkJwtUserOrganizationV,
  }),
]);

export type SdkJwtTokenRoleSpecificT = z.infer<typeof SdkJwtTokenRoleSpecificV>;

export const SdkJwtTokenV = z
  .object({
    sub: z.coerce.number(),
    exp: z.number(),
    iat: z.number(),
    email: z.string(),
    name: z.string(),
  })
  .and(SdkJwtTokenRoleSpecificV);

export type SdkJwtTokenT = z.infer<typeof SdkJwtTokenV>;
