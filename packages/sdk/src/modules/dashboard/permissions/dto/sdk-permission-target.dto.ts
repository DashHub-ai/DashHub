import { z } from 'zod';

import { SdkTableRowWithIdNameV, SdkTableRowWithIdV } from '~/shared';

import { SdkUserListItemV } from '../../users/dto/sdk-user-list-item.dto';

export const SdkPermissionTargetV = z.union([
  z.object({
    user: SdkUserListItemV,
  }),
  z.object({
    group: SdkTableRowWithIdNameV,
  }),
]);

export type SdkPermissionTargetT = z.infer<typeof SdkPermissionTargetV>;

export const SdkUpsertPermissionTargetV = z.union([
  z.object({
    user: SdkTableRowWithIdV,
  }),
  z.object({
    group: SdkTableRowWithIdV,
  }),
]);

export type SdkUpsertPermissionTargetT = z.infer<typeof SdkUpsertPermissionTargetV>;
