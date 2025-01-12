import { pipe } from 'fp-ts/lib/function';

import type { SdkJwtTokenT } from '~/modules/auth';

import {
  mapSdkOffsetPaginationItems,
  type SdkOffsetPaginationOutputT,
  type SdkTableRowWithIdT,
} from '~/shared';

import { isTechOrOwnerUserSdkOrganizationRole } from '../../organizations/dto/sdk-organization-user.dto';

type PermissionRecord = {
  permissions?: unknown;
  creator?: SdkTableRowWithIdT;
};

export function dropSdkPermissionsKeyIfNotCreator(jwt: SdkJwtTokenT) {
  return <T extends PermissionRecord>(obj: T): Omit<T, 'permissions'> => {
    if (obj.creator?.id === jwt.sub) {
      return obj;
    }

    if (jwt.role === 'root') {
      return obj;
    }

    if (isTechOrOwnerUserSdkOrganizationRole(jwt.organization.role)) {
      return obj;
    }

    const { permissions, ...rest } = obj;
    return rest;
  };
}

export function dropSdkPaginationPermissionsKeysIfNotCreator(jwt: SdkJwtTokenT) {
  return <
    T extends PermissionRecord,
    P extends SdkOffsetPaginationOutputT<T>,
  >(pagination: P) => pipe(
    pagination,
    mapSdkOffsetPaginationItems(dropSdkPermissionsKeyIfNotCreator(jwt)),
  );
}
