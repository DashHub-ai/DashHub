import { z } from 'zod';

import { SdkTableRowWithIdNameV, SdkTableRowWithIdV } from '~/shared';

import { SdkUserListItemV } from '../../users/dto/sdk-user-list-item.dto';

export const SdkPermissionTargetV = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('user'),
    user: SdkUserListItemV,
  }),
  z.object({
    type: z.literal('group'),
    group: SdkTableRowWithIdNameV,
  }),
]);

export type SdkPermissionTargetT = z.infer<typeof SdkPermissionTargetV>;

export type SdkPermissionTargetTypeT = SdkPermissionTargetT['type'];

export type SdkPermissionTargetByType<T extends SdkPermissionTargetTypeT> = Extract<
  SdkPermissionTargetT,
  { type: T; }
>;

export const SdkUpsertPermissionTargetV = z.union([
  z.object({
    user: SdkTableRowWithIdV,
  }),
  z.object({
    group: SdkTableRowWithIdV,
  }),
]);

export type SdkUpsertPermissionTargetT = z.infer<typeof SdkUpsertPermissionTargetV>;
