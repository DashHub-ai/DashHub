import type { SdkPermissionAccessLevelT, SdkUserListItemT } from '@llm/sdk';

import { Avatar } from '@llm/ui';
import { PermissionCheckboxes } from '~/modules/permissions/controls/permission-checkboxes';

type Props = {
  user: SdkUserListItemT;
  accessLevel: SdkPermissionAccessLevelT;
  onChangeAccessLevel: (accessLevel: SdkPermissionAccessLevelT) => void;
};

export function PermissionUserItem({ user, accessLevel, onChangeAccessLevel }: Props) {
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

      <PermissionCheckboxes
        value={accessLevel}
        onChange={onChangeAccessLevel}
      />
    </div>
  );
}
