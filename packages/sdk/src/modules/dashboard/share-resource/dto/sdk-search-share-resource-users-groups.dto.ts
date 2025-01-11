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
  users: z.array(SdkUserListItemV),
  groups: z.array(SdkTableRowWithIdNameV),
});

export type SdkSearchShareResourceUsersGroupsOutputT = z.infer<
  typeof SdkSearchShareResourceUsersGroupsOutputV
>;
