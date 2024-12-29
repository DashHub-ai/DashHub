import type { ReactNode } from 'react';

import clsx from 'clsx';
import { PencilIcon, TrashIcon } from 'lucide-react';

import { useForwardedI18n } from '~/i18n';

type CardButtonProps = {
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'danger';
  className?: string;
};

export function CardActionButton({
  icon,
  children,
  onClick,
  disabled,
  variant = 'default',
  className,
}: CardButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors',
        variant === 'default' && 'bg-slate-50 hover:bg-slate-100',
        variant === 'danger' && 'bg-red-50 hover:bg-red-100 text-red-600',
        disabled && 'opacity-50',
        className,
      )}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );
}

export function CardEditButton({ onClick }: { onClick: () => void; }) {
  const t = useForwardedI18n().pack;

  return (
    <CardActionButton
      icon={<PencilIcon size={12} />}
      onClick={onClick}
    >
      {t.buttons.edit}
    </CardActionButton>
  );
}

export function CardArchiveButton({ onClick, loading }: { onClick: () => void; loading?: boolean; }) {
  const t = useForwardedI18n().pack;

  return (
    <CardActionButton
      icon={<TrashIcon size={12} />}
      onClick={onClick}
      disabled={loading}
      variant="danger"
    >
      {t.buttons.archive}
    </CardActionButton>
  );
}
