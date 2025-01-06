import { reader as R, record as RE } from 'fp-ts';
import { pipe } from 'fp-ts/lib/function';

import type { SdkUserRoleT } from '~/modules/dashboard/users';

import { invert } from '@llm/commons';
import { isTechOrOwnerUserOrganizationRole } from '~/modules/dashboard/organizations/dto/sdk-organization-user.dto';

import type { SdkJwtTokenT } from '../dto';

export type SdkAccessLevelGuards = ReturnType<typeof createAccessLevelGuard>;

export function createAccessLevelGuard(jwt: SdkJwtTokenT) {
  const oneOfType = (...types: SdkUserRoleT[]) => types.includes(jwt.role);
  const noneOfType = (...types: SdkUserRoleT[]) => !oneOfType(...types);
  const isOfRole = (type: SdkUserRoleT) => type === jwt.role;

  const roles: Record<SdkUserRoleT, boolean> = {
    root: isOfRole('root'),
    user: isOfRole('user'),
  };

  const minimum: Record<SdkUserRoleT | 'techUser', boolean> = {
    root: roles.root,
    user: roles.root || roles.user,
    techUser: jwt.role === 'root' || isTechOrOwnerUserOrganizationRole(jwt.organization.role),
  };

  const not = {
    ...RE.map(invert)(roles),
    role: pipe(isOfRole, R.map(invert)),
  };

  return {
    is: {
      ...roles,
      type: isOfRole,
      noneOf: noneOfType,
      oneOf: oneOfType,
      not,
      minimum,
    },
  };
}
