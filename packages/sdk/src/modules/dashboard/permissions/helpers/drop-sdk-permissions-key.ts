import { pipe } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '~/modules/auth';

import {
  mapSdkOffsetPaginationItems,
  type SdkOffsetPaginationOutputT,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

import type { SdkTableRowWithPermissionsT } from '../dto';

import { isTechOrOwnerUserSdkOrganizationRole } from '../../organizations/dto/sdk-organization-user.dto';
import { findSdkPermissionById } from './find-sdk-permission-by-id';

export type SdkDropPermissionsKeysDescriptor = {
  jwt: SdkJwtTokenT;
  groupsIds: SdkTableRowIdT[];
};

export type SdkPermissionLikeRecordT = SdkTableRowWithPermissionsT & {
  creator?: SdkTableRowWithIdT;
};

export function dropSdkPermissionsKeyIfNotCreator({ jwt, groupsIds }: SdkDropPermissionsKeysDescriptor) {
  return <T extends SdkPermissionLikeRecordT>(obj: T): T => {
    const writableObj: T = {
      ...obj,
      permissions: {
        ...obj.permissions,
        yourAccessLevel: 'write',
      },
    };

    if (obj.creator?.id === jwt.sub) {
      return writableObj;
    }

    if (jwt.role === 'root') {
      return writableObj;
    }

    if (isTechOrOwnerUserSdkOrganizationRole(jwt.organization.role)) {
      return writableObj;
    }

    const isAnyGroupWithWriteAccess = groupsIds.some((groupId) => {
      const foundGroup = pipe(
        obj.permissions?.current ?? [],
        findSdkPermissionById('group', groupId),
      );

      return foundGroup?.accessLevel === 'write';
    });

    if (isAnyGroupWithWriteAccess) {
      return writableObj;
    }

    const isUserWithWriteAccess = pipe(
      obj.permissions?.current ?? [],
      findSdkPermissionById('user', jwt.sub),
    )?.accessLevel === 'write';

    if (isUserWithWriteAccess) {
      return writableObj;
    }

    return {
      ...obj,
      permissions: {
        yourAccessLevel: 'read',
      },
    };
  };
}

export function dropSdkPaginationPermissionsKeysIfNotCreator(descriptor: SdkDropPermissionsKeysDescriptor) {
  return <
    T extends SdkPermissionLikeRecordT,
    P extends SdkOffsetPaginationOutputT<T>,
  >(pagination: P) => pipe(
    pagination,
    mapSdkOffsetPaginationItems(dropSdkPermissionsKeyIfNotCreator(descriptor)),
  );
}
