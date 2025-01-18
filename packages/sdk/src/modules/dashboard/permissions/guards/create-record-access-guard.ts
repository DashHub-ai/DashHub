import type { SdkJwtTokenT } from '~/modules/auth';

import type { SdkPermissionLikeRecordT } from '../helpers';

import { isTechOrOwnerUserSdkOrganizationRole } from '../../organizations';

export function createRecordAccessGuard(jwt: SdkJwtTokenT) {
  return (record: SdkPermissionLikeRecordT) => {
    const isCreator = record.creator?.id === jwt.sub;
    const canArchive
      = isCreator
        || jwt.role === 'root'
        || isTechOrOwnerUserSdkOrganizationRole(jwt.organization.role);

    return {
      is: {
        creator: isCreator,
      },
      can: {
        read: ['read', 'write'].includes(record.permissions.yourAccessLevel!),
        write: record.permissions.yourAccessLevel === 'write',
        archive: canArchive,
        unarchive: canArchive,
      },
    };
  };
}
