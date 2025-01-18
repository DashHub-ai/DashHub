import clsx from 'clsx';
import { UsersIcon } from 'lucide-react';

import { useI18n } from '~/i18n';

type Props = {
  className?: string;
};

export function CardRecordPublic({ className }: Props) {
  const t = useI18n().pack.permissions.status;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1 px-1.5 py-0.5',
        'rounded max-w-[100px] w-fit',
        'bg-blue-50 text-blue-600',
        'text-xs font-medium',
        className,
      )}
      title={t.public.tooltip}
    >
      <UsersIcon size={12} />
      <span className="truncate">
        {t.public.title}
      </span>
    </div>
  );
}
