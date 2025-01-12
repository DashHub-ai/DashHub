import clsx from 'clsx';
import { GlobeIcon } from 'lucide-react';

import type { SdkPermissionT } from '@llm/sdk';

import { useI18n } from '~/i18n';

type Props = {
  permissions: SdkPermissionT[];
  className?: string;
};

export function CardRecordPublic({ className }: Props) {
  const t = useI18n().pack.permissions.status;

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 text-gray-500">
        <GlobeIcon size={16} />
        <span className="text-sm">
          {t.publicTooltip}
        </span>
      </div>
    </div>
  );
}
