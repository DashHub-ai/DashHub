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
        'relative flex flex-col bg-white shadow-sm p-4 pb-2 border rounded-lg transition-shadow',
        (href || onForwardClick) && 'hover:shadow-md cursor-pointer',
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
