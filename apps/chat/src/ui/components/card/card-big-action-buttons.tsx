import type { MouseEventHandler, ReactNode } from 'react';

import clsx from 'clsx';
import { Link } from 'wouter';

export type CardBigActionButtonProps = {
  href?: string;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
};

export function CardBigActionButton({
  href,
  icon,
  children,
  onClick,
  disabled,
  loading,
  variant = 'primary',
  className,
}: CardBigActionButtonProps) {
  const Tag: any = href ? Link : 'button';

  return (
    <Tag
      disabled={disabled || loading}
      className={clsx(
        'flex justify-center items-center gap-2 px-4 py-2.5 rounded-md w-full font-semibold text-sm transition-all duration-200',
        variant === 'primary' && [
          'bg-amber-400 text-slate-900 hover:bg-amber-500',
          'shadow-sm',
        ],
        variant === 'secondary' && [
          'text-slate-800 hover:bg-slate-100',
          'border border-slate-200',
        ],
        (disabled || loading) && 'opacity-50 pointer-events-none',
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
      <span>{children}</span>
    </Tag>
  );
}
