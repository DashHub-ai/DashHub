import type { SdkPermissionT } from '../dto';

export function isSdkPublicPermissions(permissions: SdkPermissionT[]) {
  return !permissions.length;
}
