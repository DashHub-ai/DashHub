import clsx from 'clsx';

import type { SdkPermissionT } from '@dashhub/sdk';
import type { ColorizedAvatarSize } from '~/ui';

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
              <PermissionUserAvatar
                key={JSON.stringify(permission.target)}
                user={permission.target.user}
                accessLevel={permission.accessLevel}
                size={size}
              />
            );

          case 'group':
            return (
              <PermissionGroupAvatar
                key={JSON.stringify(permission.target)}
                group={permission.target.group}
                accessLevel={permission.accessLevel}
                size={size}
              />
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
