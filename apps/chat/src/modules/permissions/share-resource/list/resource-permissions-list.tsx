import { Users2Icon, UsersIcon } from 'lucide-react';

import {
  isSdkPermissionOfTargetType,
  type SdkPermissionAccessLevelT,
  type SdkPermissionT,
  type SdkTableRowWithIdNameT,
  type SdkUserListItemT,
} from '@llm/sdk';
import { useI18n } from '~/i18n';

import {
  PermissionGroupItem,
  PermissionOwnerItem,
  PermissionUserItem,
} from './parts';

type Props = {
  creator?: SdkUserListItemT;
  permissions: SdkPermissionT[];
  onChange: (permissions: SdkPermissionT[]) => void;
};

export function ResourcePermissionsList({ creator, permissions, onChange }: Props) {
  const t = useI18n().pack.permissions.modal.list;

  const groupPermissions = permissions.filter(isSdkPermissionOfTargetType('group'));
  const userPermissions = permissions
    .filter(isSdkPermissionOfTargetType('user'))
    .filter(user => !creator || user.target.user.id !== creator.id);

  const onChangeUserAccessLevel = (user: SdkUserListItemT) => (accessLevel: SdkPermissionAccessLevelT) => {
    const newUserPermissions = userPermissions.map((permission) => {
      if (permission.target.user.id === user.id) {
        return { ...permission, accessLevel };
      }

      return permission;
    });

    onChange([
      ...newUserPermissions,
      ...groupPermissions,
    ]);
  };

  const onChangeGroupAccessLevel = (group: SdkTableRowWithIdNameT) => (accessLevel: SdkPermissionAccessLevelT) => {
    const newGroupPermissions = groupPermissions.map((permission) => {
      if (permission.target.group.id === group.id) {
        return { ...permission, accessLevel };
      }

      return permission;
    });

    onChange([
      ...userPermissions,
      ...newGroupPermissions,
    ]);
  };

  const onUserDelete = (user: SdkUserListItemT) => {
    onChange([
      ...userPermissions.filter(permission => permission.target.user.id !== user.id),
      ...groupPermissions,
    ]);
  };

  const onGroupDelete = (group: SdkTableRowWithIdNameT) => {
    onChange([
      ...userPermissions,
      ...groupPermissions.filter(permission => permission.target.group.id !== group.id),
    ]);
  };

  return (
    <div className="border rounded-md divide-y max-h-[20rem] overflow-y-auto">
      <div>
        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 font-medium text-gray-500 text-xs">
          <UsersIcon size={14} />
          {t.users}
        </div>

        <div className="divide-y">
          {creator && (
            <PermissionOwnerItem creator={creator} />
          )}

          {userPermissions.map(permission => (
            <PermissionUserItem
              key={permission.target.user.id}
              user={permission.target.user}
              accessLevel={permission.accessLevel}
              onChangeAccessLevel={onChangeUserAccessLevel(permission.target.user)}
              onDelete={() => onUserDelete(permission.target.user)}
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
                onChangeAccessLevel={onChangeGroupAccessLevel(permission.target.group)}
                onDelete={() => onGroupDelete(permission.target.group)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
