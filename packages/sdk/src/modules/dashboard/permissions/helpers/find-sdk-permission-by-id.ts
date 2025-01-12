import type { SdkTableRowIdT } from '~/shared';

import type { SdkPermissionT, SdkPermissionTargetTypeT } from '../dto';

export function findSdkPermissionById(target: SdkPermissionTargetTypeT, id: SdkTableRowIdT) {
  return (permissions: SdkPermissionT[]) => permissions.find((permission) => {
    switch (target) {
      case 'user':
        return permission.target.type === target && permission.target.user.id === id;

      case 'group':
        return permission.target.type === target && permission.target.group.id === id;

      default: {
        const _: never = target;

        return false;
      }
    }
  });
}
