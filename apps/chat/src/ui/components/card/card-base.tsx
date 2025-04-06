import type { MouseEventHandler, PropsWithChildren } from 'react';

import clsx from 'clsx';
import { useLocation } from 'wouter';

type CardBaseProps = PropsWithChildren & {
  href?: string;
  disabled?: boolean;
  className?: string;
  onClick?: VoidFunction;
};

export function CardBase(
  {
    href,
    disabled,
    children,
    className,
    onClick: onForwardClick,
  }: CardBaseProps,
) {
  const [, navigate] = useLocation();

  const shouldHandleClick = (target: EventTarget | null) =>
    !(target instanceof Element && target.closest('a, button'));

  const onMouseDown: MouseEventHandler = (event) => {
    if (!shouldHandleClick(event.target)) {
      return;
    }

    if (event.button === 1 && href) {
      event.preventDefault();

      window.open(href, '_blank');
    }
  };

  const onClick: MouseEventHandler = (event) => {
    if (!shouldHandleClick(event.target)) {
      return;
    }

    if (event.button === 0) {
      if (href) {
        event.preventDefault();
        navigate(href);
      }
      else {
        onForwardClick?.();
      }
    }
  };

  return (
    <div
      className={clsx(
        'relative flex flex-col bg-white/95 p-4 pb-2 rounded-lg transition-all duration-200',
        'border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        'backdrop-blur-[2px] backdrop-saturate-[1.8]',
        (href || onForwardClick) && [
          'hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]',
          'hover:border-slate-300/80',
          'hover:translate-y-[-1px]',
          'cursor-pointer',
        ],
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </div>
  );
}
