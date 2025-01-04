import { z } from 'zod';

import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithIdV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkUserListItemV } from '../../users/dto';
import { SdkPermissionAccessLevelV } from './sdk-permission-level.dto';

export const SdkPermissionResourceV = z.object({
  chat: SdkTableRowWithUuidV.nullable(),
  project: SdkTableRowWithIdV.nullable(),
  app: SdkTableRowWithIdV.nullable(),
});

export type SdkPermissionResourceT = z.infer<typeof SdkPermissionResourceV>;

export const SdkPermissionTargetV = z.union([
  z.object({
    user: SdkUserListItemV,
    group: z.null(),
  }),
  z.object({
    group: SdkTableRowWithIdNameV,
    user: z.null(),
  }),
]);

export type SdkPermissionTargetT = z.infer<typeof SdkPermissionTargetV>;

export const SdkPermissionV = z
  .object({
    resource: SdkPermissionResourceV,
    accessLevel: SdkPermissionAccessLevelV,
    target: SdkPermissionTargetV,
  })
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV);

export type SdkPermissionT = z.infer<typeof SdkPermissionV>;
