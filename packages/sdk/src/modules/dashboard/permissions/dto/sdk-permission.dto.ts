import { z } from 'zod';

import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithIdV,
  SdkTableRowWithUuidV,
} from '~/shared';

import { SdkUserListItemV } from '../../users/dto';
import { SdkPermissionAccessLevelV } from './sdk-permission-level.dto';

export const SdkPermissionV = z
  .object({
    chat: SdkTableRowWithUuidV.nullable(),
    project: SdkTableRowWithIdV.nullable(),
    app: SdkTableRowWithIdV.nullable(),
    accessLevel: SdkPermissionAccessLevelV,
  })
  .merge(SdkTableRowWithIdV)
  .merge(SdkTableRowWithDatesV)
  .and(
    z.union([
      z.object({
        user: SdkUserListItemV,
        group: z.null(),
      }),
      z.object({
        group: SdkTableRowWithIdNameV,
        user: z.null(),
      }),
    ]),
  );

export type SdkPermissionT = z.infer<typeof SdkPermissionV>;
