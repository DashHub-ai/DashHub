import type { ReactNode } from 'react';

import clsx from 'clsx';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { Link } from 'wouter';

import { useI18n } from '~/i18n';

type CardButtonProps = {
  href?: string;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'danger';
  className?: string;
};

export function CardActionButton({
  href,
  icon,
  children,
  onClick,
  disabled,
  variant = 'default',
  className,
}: CardButtonProps) {
  const Tag: any = href ? Link : 'button';

  return (
    <Tag
      disabled={disabled}
      className={clsx(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all duration-200',
        variant === 'default' && [
          'bg-slate-50/80 hover:bg-slate-100 border border-slate-100',
          'backdrop-blur-[1px]',
          'hover:shadow-sm',
        ],
        variant === 'danger' && [
          'bg-red-50/90 hover:bg-red-100/90 text-red-600 border border-red-100',
          'backdrop-blur-[1px]',
          'hover:shadow-sm',
        ],
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
      onClick={onClick}
      {...href
        ? {
            href,
          }
        : {
            type: 'button',
          }}
    >
      {icon}
      {children}
    </Tag>
  );
}

export function CardEditButton({ disabled, loading, ...props }: PredefinedActionButtonProps) {
  const t = useI18n().pack;

  return (
    <CardActionButton
      icon={<PencilIcon size={12} />}
      disabled={disabled || loading}
      {...props}
    >
      {t.buttons.edit}
    </CardActionButton>
  );
}

export function CardArchiveButton({ disabled, loading, ...props }: PredefinedActionButtonProps) {
  const t = useI18n().pack;

  return (
    <CardActionButton
      icon={<TrashIcon size={12} />}
      disabled={disabled || loading}
      variant="danger"
      {...props}
    >
      {t.buttons.archive}
    </CardActionButton>
  );
}

export function CardUnarchiveButton({ disabled, loading, ...props }: PredefinedActionButtonProps) {
  const t = useI18n().pack;

  return (
    <CardActionButton
      icon={<TrashIcon size={12} />}
      disabled={disabled || loading}
      {...props}
    >
      {t.buttons.unarchive}
    </CardActionButton>
  );
}

type PredefinedActionButtonProps = {
  href?: string;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};
