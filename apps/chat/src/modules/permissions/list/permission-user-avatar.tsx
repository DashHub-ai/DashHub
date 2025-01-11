import { UserCircle2 } from 'lucide-react';

import type { SdkUserListItemT } from '@llm/sdk';

import { Avatar, Tooltip } from '@llm/ui';

type Props = {
  user: SdkUserListItemT;
  accessLevel: string;
};

export function PermissionUserAvatar({ user, accessLevel }: Props) {
  return (
    <Tooltip content={`${user.email} (${accessLevel})`}>
      <Avatar
        size="sm"
        name={user.email}
        fallback={<UserCircle2 size={24} />}
      />
    </Tooltip>
  );
}
