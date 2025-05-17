import { Users2 } from 'lucide-react';

import type { SdkTableRowWithIdNameT } from '@dashhub/sdk';

import { Avatar, type AvatarSize, Tooltip } from '~/ui';

type Props = {
  group: SdkTableRowWithIdNameT;
  accessLevel: string;
  size?: AvatarSize;
};

export function PermissionGroupAvatar({ group, accessLevel, size = 'sm' }: Props) {
  return (
    <Tooltip content={`${group.name} (${accessLevel})`}>
      <span className="inline-block transition-transform hover:-translate-y-1 transform">
        <Avatar
          size={size}
          name={group.name}
          fallback={<Users2 size={16} />}
          className="shadow-sm border-2 border-gray-300"
        />
      </span>
    </Tooltip>
  );
}
