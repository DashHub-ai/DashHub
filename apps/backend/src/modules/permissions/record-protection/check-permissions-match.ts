import type { SdkPermissionT, SdkTableRowWithPermissionsT } from '@llm/sdk';

import type { UserAccessPermissionsDescriptor } from './permissions-row-protection-filters.types';

export function checkPermissionsMatch(
  descriptor: UserAccessPermissionsDescriptor,
  row: SdkTableRowWithPermissionsT,
): boolean {
  const { permissions } = row;

  // If no permissions are set, it means public access
  if (!permissions) {
    return true;
  }

  // Check both inherited and current permissions
  return (
    checkPermissionsKindMatch(permissions.inherited, descriptor)
    && checkPermissionsKindMatch(permissions.current, descriptor)
  );
}

function checkPermissionsKindMatch(
  permissions: SdkPermissionT[],
  descriptor: UserAccessPermissionsDescriptor,
): boolean {
  const { userId, groupsIds, accessLevel } = descriptor;

  // If no permissions are set for this kind, it means public access
  if (!permissions || permissions.length === 0) {
    return true;
  }

  const accessLevels = accessLevel === 'read'
    ? ['read', 'write'] // if requesting read, allow both read and write
    : [accessLevel]; // if requesting write, only allow write

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
