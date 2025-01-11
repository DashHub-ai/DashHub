import { Users2Icon, UsersIcon } from 'lucide-react';

import {
  isSdkPermissionOfTargetType,
  type SdkPermissionT,
  type SdkUserListItemT,
} from '@llm/sdk';
import { useI18n } from '~/i18n';

import {
  PermissionGroupItem,
  PermissionOwnerItem,
  PermissionUserItem,
} from './parts';

type Props = {
  creator: SdkUserListItemT;
  permissions: SdkPermissionT[];
};

export function ResourcePermissionsList({ creator, permissions }: Props) {
  const t = useI18n().pack.permissions.modal.list;

  const userPermissions = permissions.filter(isSdkPermissionOfTargetType('user'));
  const groupPermissions = permissions.filter(isSdkPermissionOfTargetType('group'));

  return (
    <div className="border rounded-md divide-y max-h-[20rem] overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 font-medium text-gray-500 text-xs">
          <UsersIcon size={14} />
          {t.users}
        </div>

        <div className="divide-y">
          <PermissionOwnerItem creator={creator} />

          {userPermissions.map(permission => (
            <PermissionUserItem
              key={permission.target.user.id}
              user={permission.target.user}
              accessLevel={permission.accessLevel}
            />
          ))}
        </div>
      </div>

      {groupPermissions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 font-medium text-gray-500 text-xs">
            <Users2Icon size={14} />
            {t.groups}
          </div>

          <div className="divide-y">
            {groupPermissions.map(permission => (
              <PermissionGroupItem
                key={permission.target.group.id}
                group={permission.target.group}
                accessLevel={permission.accessLevel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
