import { Trash, UsersIcon } from 'lucide-react';

import type { SdkPermissionAccessLevelT, SdkTableRowWithIdNameT } from '@llm/sdk';

import { PermissionCheckboxes } from '~/modules/permissions/controls/permission-checkboxes';

type Props = {
  group: SdkTableRowWithIdNameT;
  accessLevel: SdkPermissionAccessLevelT;
  onChangeAccessLevel: (accessLevel: SdkPermissionAccessLevelT) => void;
  onDelete: () => void;
};

export function PermissionGroupItem({ group, accessLevel, onChangeAccessLevel, onDelete }: Props) {
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

      <PermissionCheckboxes
        value={accessLevel}
        onChange={onChangeAccessLevel}
      />

      <button
        type="button"
        onClick={onDelete}
        className="text-gray-500 hover:text-red-600"
      >
        <Trash className="w-5 h-5" />
      </button>
    </div>
  );
}
