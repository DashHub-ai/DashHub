import { pipe } from 'fp-ts/lib/function';

import {
  mapSdkOffsetPaginationItems,
  type SdkOffsetPaginationOutputT,
} from '~/shared';

export function dropSdkPermissionsKey<T extends { permissions?: unknown; }>(obj: T): Omit<T, 'permissions'> {
  const { permissions, ...rest } = obj;
  return rest;
}

export function dropPaginationSdkPermissionsKeys<
  T,
  P extends SdkOffsetPaginationOutputT<T & { permissions?: unknown; }>,
>(pagination: P) {
  return pipe(
    pagination,
    mapSdkOffsetPaginationItems(dropSdkPermissionsKey),
  );
}
