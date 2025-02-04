import type { SdkPermissionAccessLevelT, SdkUserListItemT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { ColorizedAvatar, type ColorizedAvatarSize, Tooltip } from '~/ui';

type Props = {
  user: SdkUserListItemT;
  accessLevel: SdkPermissionAccessLevelT;
  size?: ColorizedAvatarSize;
};

export function PermissionUserAvatar({ user, accessLevel, size = 'sm' }: Props) {
  const { accessLevels } = useI18n().pack.permissions;

  return (
    <Tooltip content={`${user.email} (${accessLevels[accessLevel]})`}>
      <span className="inline-block transform transition-transform hover:-translate-y-1">
        <ColorizedAvatar
          id={user.id}
          name={user.name}
          size={size}
          className="shadow-sm"
        />
      </span>
    </Tooltip>
  );
}
