import type { SdkUserListItemT } from '@llm/sdk';

import { ColorizedAvatar, Tooltip } from '@llm/ui';

type Props = {
  user: SdkUserListItemT;
  accessLevel: string;
};

export function PermissionUserAvatar({ user, accessLevel }: Props) {
  return (
    <Tooltip content={`${user.email} (${accessLevel})`}>
      <div className="transform transition-transform hover:-translate-y-1">
        <ColorizedAvatar
          id={user.id}
          name={user.name}
          size="sm"
        />
      </div>
    </Tooltip>
  );
}
