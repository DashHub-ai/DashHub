import type { ReactNode } from 'react';

import clsx from 'clsx';
import { Link } from 'wouter';

import type { CanBePromise } from '@dashhub/commons';

import { useAsyncCallback } from '@dashhub/commons-front';

export type CardBigActionButtonProps = {
  href?: string;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => CanBePromise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'primary-outline';
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

  const [onAsyncClick, asyncClickState] = useAsyncCallback(async () => {
    await onClick?.();
  });

  return (
    <Tag
      disabled={disabled || loading || asyncClickState.isLoading}
      className={clsx(
        'flex justify-center items-center gap-2 px-4 py-2.5 rounded-md w-full font-semibold text-sm transition-all duration-200',
        variant === 'primary' && [
          'bg-amber-400 text-slate-900 hover:bg-amber-500',
          'shadow-sm',
        ],
        variant === 'secondary' && [
          'text-slate-800 bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100',
          'backdrop-blur-[1px]',
          'hover:shadow-sm',
        ],
        (disabled || loading || asyncClickState.isLoading) && 'opacity-50 pointer-events-none',
        className,
      )}
      onClick={(e: MouseEvent) => {
        if (onClick && !href) {
          e.stopPropagation();
          void onAsyncClick();
        }
      }}
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
