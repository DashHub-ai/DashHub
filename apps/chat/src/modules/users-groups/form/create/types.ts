import type { SdkCreateUsersGroupInputT, SdkUserListItemT } from '@dashhub/sdk';

export type CreateUsersGroupValue = Omit<SdkCreateUsersGroupInputT, 'users'> & {
  users: SdkUserListItemT[];
};
