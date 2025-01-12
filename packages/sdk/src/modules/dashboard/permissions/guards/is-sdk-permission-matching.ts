import type { SdkTableRowIdT } from '~/shared';

import type {
  SdkPermissionAccessLevelT,
  SdkPermissionT,
  SdkTableRowWithPermissionsT,
} from '../dto';

export type SdkUserAccessPermissionsDescriptor = {
  accessLevel: SdkPermissionAccessLevelT;
  userId: SdkTableRowIdT;
  groupsIds: SdkTableRowIdT[];
};

export function isSdkPermissionMatching(
  descriptor: SdkUserAccessPermissionsDescriptor,
  row: SdkTableRowWithPermissionsT,
): boolean {
  const { permissions } = row;

  // If no permissions are set, it means public access can only read.
  if (!permissions) {
    return descriptor.accessLevel === 'read';
  }

  // If cannot read parent, cannot read child and write
  if (!checkPermissionsKindMatch(permissions.inherited, { ...descriptor, accessLevel: 'read' })) {
    return false;
  }

  // Check if can write to child
  return checkPermissionsKindMatch(permissions.current, descriptor);
}

function checkPermissionsKindMatch(
  permissions: SdkPermissionT[],
  descriptor: SdkUserAccessPermissionsDescriptor,
): boolean {
  const { userId, groupsIds, accessLevel } = descriptor;

  const accessLevels = accessLevel === 'read'
    ? ['read', 'write'] // if requesting read, allow both read and write
    : [accessLevel]; // if requesting write, only allow write

  // If no permissions are set for this kind, it means public access
  if (!permissions || permissions.length === 0) {
    return accessLevel === 'read';
  }

  // Check if any permission matches
  return permissions.some((permission) => {
    // Check if access level matches
    if (!accessLevels.includes(permission.accessLevel)) {
      return false;
    }

    // Check user-level permission
    if ('user' in permission.target && permission.target.user.id === userId) {
      return true;
    }

    // Check group-level permission
    if ('group' in permission.target && groupsIds.includes(permission.target.group.id)) {
      return true;
    }

    return false;
  });
}
