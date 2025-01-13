import { Users2 } from 'lucide-react';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { Avatar, type AvatarSize, Tooltip } from '@llm/ui';

type Props = {
  group: SdkTableRowWithIdNameT;
  accessLevel: string;
  size?: AvatarSize;
};

export function PermissionGroupAvatar({ group, accessLevel, size = 'sm' }: Props) {
  return (
    <Tooltip content={`${group.name} (${accessLevel})`}>
      <span className="inline-block transform transition-transform hover:-translate-y-1">
        <Avatar
          size={size}
          name={group.name}
          fallback={<Users2 size={16} />}
          className="border-2 border-gray-300 shadow-sm"
        />
      </span>
    </Tooltip>
  );
}
