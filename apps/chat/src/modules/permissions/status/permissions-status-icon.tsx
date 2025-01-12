import clsx from 'clsx';
import { EyeIcon, UsersIcon } from 'lucide-react';

import { isSdkPublicPermissions, type SdkPermissionT } from '@llm/sdk';
import { Tooltip } from '@llm/ui';
import { useI18n } from '~/i18n';

type Props = {
  permissions: SdkPermissionT[];
  className?: string;
};

export function PermissionsStatusIcon({ permissions, className }: Props) {
  const t = useI18n().pack.permissions.status;
  const isPublic = isSdkPublicPermissions(permissions);

  return (
    <Tooltip
      content={isPublic ? t.publicTooltip : t.privateTooltip}
      wrapperClassName={clsx('text-gray-500', className)}
    >
      {(
        isPublic
          ? <EyeIcon size={14} />
          : <UsersIcon size={14} />
      )}
    </Tooltip>
  );
}
