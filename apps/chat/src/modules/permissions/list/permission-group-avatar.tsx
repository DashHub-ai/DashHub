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
      <Avatar
        size={size}
        name={group.name}
        fallback={<Users2 size={24} />}
      />
    </Tooltip>
  );
}
