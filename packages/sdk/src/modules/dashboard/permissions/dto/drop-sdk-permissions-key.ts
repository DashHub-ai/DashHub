import { pipe } from 'fp-ts/lib/function';

import {
  mapSdkOffsetPaginationItems,
  type SdkOffsetPaginationOutputT,
  type SdkTableRowIdT,
  type SdkTableRowWithIdT,
} from '~/shared';

type PermissionRecord = {
  permissions?: unknown;
  creator?: SdkTableRowWithIdT;
};

export function dropSdkPermissionsKeyIfNotCreator(userId: SdkTableRowIdT) {
  return <T extends PermissionRecord>(obj: T): Omit<T, 'permissions'> => {
    if (obj.creator?.id === userId) {
      return obj;
    }

    const { permissions, ...rest } = obj;
    return rest;
  };
}

export function dropSdkPaginationPermissionsKeysIfNotCreator(userId: SdkTableRowIdT) {
  return <
    T extends PermissionRecord,
    P extends SdkOffsetPaginationOutputT<T>,
  >(pagination: P) => pipe(
    pagination,
    mapSdkOffsetPaginationItems(dropSdkPermissionsKeyIfNotCreator(userId)),
  );
}
