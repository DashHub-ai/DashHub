import type { SdkPermissionAccessLevelT, SdkUserListItemT } from '@llm/sdk';

import { useI18n } from '~/i18n';
import { Avatar, ColorizedAvatar, type ColorizedAvatarSize, Tooltip } from '~/ui';

type Props = {
  user: SdkUserListItemT;
  accessLevel: SdkPermissionAccessLevelT;
  size?: ColorizedAvatarSize;
};

export function PermissionUserAvatar({ user, accessLevel, size = 'sm' }: Props) {
  const { accessLevels } = useI18n().pack.permissions;
  const sharedProps = {
    name: user.name,
    size,
    className: 'shadow-sm transition-transform hover:-translate-y-1 transform',
  };

  return (
    <Tooltip
      content={`${user.email} (${accessLevels[accessLevel]})`}
      wrapperClassName="inline-flex"
    >
      {user.avatar
        ? (
            <Avatar
              {...sharedProps}
              src={user.avatar.publicUrl}
            />
          )
        : (
            <ColorizedAvatar
              {...sharedProps}
              id={user.id}
            />
          )}
    </Tooltip>
  );
}
