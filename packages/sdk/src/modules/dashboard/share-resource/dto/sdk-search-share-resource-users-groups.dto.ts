import { z } from 'zod';

import { SdkFilteredPhraseInputV, SdkTableRowIdV, SdkTableRowWithIdNameV } from '~/shared';

import { SdkUserListItemV } from '../../users';

export const SdkSearchShareResourceUsersGroupsInputV = SdkFilteredPhraseInputV.extend({
  organizationId: SdkTableRowIdV,
});

export type SdkSearchShareResourceUsersGroupsInputT = z.infer<
  typeof SdkSearchShareResourceUsersGroupsInputV
>;

export const SdkSearchShareResourceUsersGroupsOutputV = z.object({
  groups: z.array(SdkTableRowWithIdNameV),
  users: z.array(SdkUserListItemV),
});

export type SdkSearchShareResourceUsersGroupsOutputT = z.infer<
  typeof SdkSearchShareResourceUsersGroupsOutputV
>;
