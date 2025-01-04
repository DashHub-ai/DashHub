import { z } from 'zod';

import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithIdV,
} from '~/shared';

import { SdkUserListItemV } from '../../users/dto';
import { SdkPermissionAccessLevelV } from './sdk-permission-level.dto';
import { SdkPermissionResourceV } from './sdk-permission-resource.dto';

export const SdkPermissionTargetV = z.union([
  z.object({
    user: SdkUserListItemV,
  }),
  z.object({
    group: SdkTableRowWithIdNameV,
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
