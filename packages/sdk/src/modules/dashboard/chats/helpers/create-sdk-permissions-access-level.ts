import type { SdkTableRowIdT } from '~/shared';

import type {
  SdkPermissionAccessLevelT,
  SdkUpsertPermissionT,
  SdkUpsertPermissionTargetT,
} from '../../permissions';

export function createSDKPermissionsAccessLevel(
  accessLevel: SdkPermissionAccessLevelT,
  target: SdkUpsertPermissionTargetT,
): SdkUpsertPermissionT {
  return {
    accessLevel,
    target,
  };
}

export function createSDKPermissionUserAccessLevel(
  accessLevel: SdkPermissionAccessLevelT,
  userId: SdkTableRowIdT,
) {
  return createSDKPermissionsAccessLevel(accessLevel, {
    user: {
      id: userId,
    },
  });
}
