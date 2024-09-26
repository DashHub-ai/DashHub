import { z } from 'zod';

import { SdkOrganizationUserRoleV } from '~/modules/dashboard/organizations';

export const JWTUserOrganizationV = z.object({
  id: z.coerce.number(),
  name: z.string(),
  role: SdkOrganizationUserRoleV,
});

export type JWTUserOrganizationT = z.infer<typeof JWTUserOrganizationV>;

export const JWTTokenRoleSpecificV = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('root'),
  }),
  z.object({
    role: z.literal('user'),
    organization: JWTUserOrganizationV,
  }),
]);

export type JWTTokenRoleSpecificT = z.infer<typeof JWTTokenRoleSpecificV>;

export const JWTTokenV = z
  .object({
    sub: z.coerce.number(),
    exp: z.number(),
    iat: z.number(),
    email: z.string(),
  })
  .and(JWTTokenRoleSpecificV);

export type JWTTokenT = z.infer<typeof JWTTokenV>;
