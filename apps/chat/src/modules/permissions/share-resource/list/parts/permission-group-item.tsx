import { UsersIcon } from 'lucide-react';

import type { SdkPermissionAccessLevelT, SdkTableRowWithIdNameT } from '@llm/sdk';

type Props = {
  group: SdkTableRowWithIdNameT;
  accessLevel: SdkPermissionAccessLevelT;
};

export function PermissionGroupItem({ group }: Props) {
  return (
    <div className="flex items-center gap-3 hover:bg-gray-50 px-4 py-2">
      <div className="flex justify-center items-center bg-gray-100 rounded-full w-8 h-8">
        <UsersIcon size={16} className="text-gray-600" />
      </div>

      <div className="flex-1 truncate">
        <div className="font-medium text-gray-900 text-sm">
          {group.name}
        </div>
      </div>
    </div>
  );
}
