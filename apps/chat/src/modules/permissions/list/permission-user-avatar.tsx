import type { SdkPermissionAccessLevelT, SdkUserListItemT } from '@llm/sdk';

import { ColorizedAvatar, Tooltip } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = {
  user: SdkUserListItemT;
  accessLevel: SdkPermissionAccessLevelT;
};

export function PermissionUserAvatar({ user, accessLevel }: Props) {
  const { accessLevels } = useI18n().pack.permissions;

  return (
    <Tooltip content={`${user.email} (${accessLevels[accessLevel]})`}>
      <div className="transform transition-transform hover:-translate-y-1">
        <ColorizedAvatar
          id={user.id}
          name={user.name}
          size="sm"
          className="shadow-sm"
        />
      </div>
    </Tooltip>
  );
}
