import { z } from 'zod';

import {
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
  SdkTableRowWithIdV,
} from '~/shared';

import { SdkUserListItemV } from '../../users/dto';

export const SdkProjectPolicyV = z
  .object({
    project: SdkTableRowWithIdNameV,
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

export type SdkProjectPolicyT = z.infer<typeof SdkProjectPolicyV>;
