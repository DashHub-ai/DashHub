import type { SdkUserListItemT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { Avatar } from '~/ui';

type Props = {
  creator: SdkUserListItemT;
};

export function PermissionOwnerItem({ creator }: Props) {
  const t = useI18n().pack.permissions.modal.list;

  return (
    <div className="flex items-center gap-3 hover:bg-gray-50 px-4 py-2">
      <Avatar
        name={creator.name}
        size="sm"
      />

      <div className="flex-1 truncate">
        <div className="font-medium text-gray-900 text-sm">
          {creator.name}
        </div>
        <div className="text-gray-500 text-sm">
          {creator.email}
        </div>
      </div>

      <div className="bg-blue-100 px-2 py-1 rounded-md font-semibold text-blue-700 text-xs">
        {t.owner}
      </div>
    </div>
  );
}
