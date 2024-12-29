import type { SdkCreateUsersGroupInputT, SdkUserListItemT } from '@llm/sdk';

export type CreateUsersGroupValue = Omit<SdkCreateUsersGroupInputT, 'users'> & {
  users: SdkUserListItemT[];
};
