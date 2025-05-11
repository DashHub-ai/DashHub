import clsx from 'clsx';
import { UsersIcon } from 'lucide-react';

import type { SdkPermissionT } from '@dashhub/sdk';

import { useI18n } from '~/i18n';

import { PermissionAvatarsList } from '../../list/permission-avatars-list';

type Props = {
  permissions: SdkPermissionT[];
  className?: string;
};

export function CardRecordSharedWith({ permissions, className }: Props) {
  const t = useI18n().pack.permissions.card;

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 text-gray-500">
        <UsersIcon size={16} />
        <span className="text-xs">
          {t.sharedWith}
          :
        </span>
      </div>

      <PermissionAvatarsList permissions={permissions} size="xs" />
    </div>
  );
}
