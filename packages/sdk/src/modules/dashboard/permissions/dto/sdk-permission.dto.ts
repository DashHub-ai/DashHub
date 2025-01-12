import { z } from 'zod';

import type { Overwrite } from '@llm/commons';

import type {
  SdkPermissionTargetByType,
  SdkPermissionTargetTypeT,
} from './sdk-permission-target.dto';

import { SdkPermissionAccessLevelV } from './sdk-permission-level.dto';
import {
  SdkPermissionTargetV,
} from './sdk-permission-target.dto';

export const SdkPermissionV = z.object({
  accessLevel: SdkPermissionAccessLevelV,
  target: SdkPermissionTargetV,
});

export type SdkPermissionT = z.infer<typeof SdkPermissionV>;

export const SdkPermissionsV = z.object({
  inherited: z.array(SdkPermissionV),
  current: z.array(SdkPermissionV),
});

export type SdkPermissionsT = z.infer<typeof SdkPermissionsV>;

export function isSdkPermissionOfTargetType<const T extends SdkPermissionTargetTypeT>(target: T) {
  return (permission: SdkPermissionT): permission is Overwrite<SdkPermissionT, { target: SdkPermissionTargetByType<T>; }> => {
    return permission.target.type === target;
  };
}
