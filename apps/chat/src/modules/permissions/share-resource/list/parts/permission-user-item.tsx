import type { SdkPermissionAccessLevelT, SdkUserListItemT } from '@llm/sdk';

import { Avatar } from '@llm/ui';

type Props = {
  user: SdkUserListItemT;
  accessLevel: SdkPermissionAccessLevelT;
};

export function PermissionUserItem({ user }: Props) {
  return (
    <div className="flex items-center gap-3 hover:bg-gray-50 px-4 py-2">
      <Avatar
        name={user.name}
        size="sm"
      />

      <div className="flex-1 truncate">
        <div className="font-medium text-gray-900 text-sm">
          {user.name}
        </div>
        <div className="text-gray-500 text-sm">
          {user.email}
        </div>
      </div>
    </div>
  );
}
