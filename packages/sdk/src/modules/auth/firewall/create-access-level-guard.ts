import { reader as R, record as RE } from 'fp-ts';
import { invert } from 'fp-ts-std/Boolean';
import { pipe } from 'fp-ts/lib/function';

import type { SdkUserRoleT } from '~/modules/dashboard/users';

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

  const minimum: Record<SdkUserRoleT, boolean> = {
    root: roles.root,
    user: roles.root || roles.user,
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
