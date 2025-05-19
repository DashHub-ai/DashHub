import { EyeIcon, UsersIcon } from 'lucide-react';

import { isSdkPublicPermissions, type SdkPermissionT } from '@dashhub/sdk';
import { useI18n } from '~/i18n';
import { Tooltip } from '~/ui';

type Props = {
  permissions: SdkPermissionT[];
  className?: string;
};

export function PermissionsStatusIcon({ permissions, className }: Props) {
  const t = useI18n().pack.permissions.status;
  const isPublic = isSdkPublicPermissions(permissions);

  return (
    <Tooltip
      content={isPublic ? t.public.tooltip : t.private.tooltip}
      wrapperClassName={className}
    >
      {(
        isPublic
          ? <EyeIcon size={14} />
          : <UsersIcon size={14} />
      )}
    </Tooltip>
  );
}
