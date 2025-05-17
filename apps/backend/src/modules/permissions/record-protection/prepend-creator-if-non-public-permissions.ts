import type { UserTableRowBaseRelation } from '~/modules/users';

import { findSdkPermissionById, isSdkPublicPermissions, type SdkPermissionT } from '@dashhub/sdk';

export function prependCreatorIfNonPublicPermissions(creator: UserTableRowBaseRelation) {
  return (permissions: SdkPermissionT[]): SdkPermissionT[] => {
    if (!isSdkPublicPermissions(permissions) && !findSdkPermissionById('user', creator.id)(permissions)) {
      return [
        ...permissions,
        {
          accessLevel: 'write',
          target: {
            type: 'user',
            user: {
              ...creator,
              avatar: null,
            },
          },
        },
      ];
    }

    return permissions;
  };
}
