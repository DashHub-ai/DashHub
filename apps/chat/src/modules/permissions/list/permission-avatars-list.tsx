import clsx from 'clsx';

import type { SdkPermissionT } from '@llm/sdk';
import type { ColorizedAvatarSize } from '@llm/ui';

import { PermissionGroupAvatar } from './permission-group-avatar';
import { PermissionUserAvatar } from './permission-user-avatar';

type Props = {
  permissions: SdkPermissionT[];
  className?: string;
  size?: ColorizedAvatarSize;
};

export function PermissionAvatarsList({ permissions, className, size }: Props) {
  return (
    <div className={clsx('flex -space-x-2', className)}>
      {permissions.map((permission) => {
        const { type } = permission.target;

        switch (type) {
          case 'user':
            return (
              <div key={JSON.stringify(permission.target)}>
                <PermissionUserAvatar
                  user={permission.target.user}
                  accessLevel={permission.accessLevel}
                  size={size}
                />
              </div>
            );

          case 'group':
            return (
              <div key={JSON.stringify(permission.target)}>
                <PermissionGroupAvatar
                  group={permission.target.group}
                  accessLevel={permission.accessLevel}
                  size={size}
                />
              </div>
            );

          default: {
            const _: never = type;

            return null;
          }
        }
      })}
    </div>
  );
}
