import clsx from 'clsx';

import type { SdkPermissionT } from '@llm/sdk';

import { PermissionGroupAvatar } from './permission-group-avatar';
import { PermissionUserAvatar } from './permission-user-avatar';

type Props = {
  permissions: SdkPermissionT[];
  className?: string;
};

export function PermissionAvatarsList({ permissions, className }: Props) {
  return (
    <div className={clsx('flex -space-x-2', className)}>
      {permissions.map(permission => (
        <div
          key={JSON.stringify(permission.target)}
          className="inline-block border-2 border-white rounded-full"
        >
          {'user' in permission.target
            ? (
                <PermissionUserAvatar
                  user={permission.target.user}
                  accessLevel={permission.accessLevel}
                />
              )
            : (
                <PermissionGroupAvatar
                  group={permission.target.group}
                  accessLevel={permission.accessLevel}
                />
              )}
        </div>
      ))}
    </div>
  );
}
