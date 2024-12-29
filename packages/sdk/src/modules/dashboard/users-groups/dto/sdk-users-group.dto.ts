import { z } from 'zod';

import {
  SdkIdNameUrlEntryV,
  SdkTableRowWithArchivedV,
  SdkTableRowWithDatesV,
  SdkTableRowWithIdNameV,
} from '~/shared';

import { SdkUserListItemV } from '../../users/dto/sdk-user-list-item.dto';

export const SdkUsersGroupV = z.strictObject({
  organization: SdkIdNameUrlEntryV,
  creator: SdkUserListItemV,
  users: z.array(SdkUserListItemV),
})
  .merge(SdkTableRowWithIdNameV)
  .merge(SdkTableRowWithDatesV)
  .merge(SdkTableRowWithArchivedV);

export type SdkUsersGroupT = z.infer<typeof SdkUsersGroupV>;
