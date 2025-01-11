import { Users2 } from 'lucide-react';

import type { SdkTableRowWithIdNameT } from '@llm/sdk';

import { Avatar, Tooltip } from '@llm/ui';

type Props = {
  group: SdkTableRowWithIdNameT;
  accessLevel: string;
};

export function PermissionGroupAvatar({ group, accessLevel }: Props) {
  return (
    <Tooltip content={`${group.name} (${accessLevel})`}>
      <Avatar
        size="sm"
        name={group.name}
        fallback={<Users2 size={24} />}
      />
    </Tooltip>
  );
}
