import type { MouseEventHandler, PropsWithChildren } from 'react';

import clsx from 'clsx';

type CardBaseProps = PropsWithChildren & {
  disabled?: boolean;
  className?: string;
  onClick?: VoidFunction;
};

export function CardBase(
  {
    disabled,
    children,
    className,
    onClick: onForwardClick,
  }: CardBaseProps,
) {
  const onClick: MouseEventHandler = ({ target }) => {
    if (target instanceof HTMLElement && target.closest('a, button')) {
      return;
    }

    onForwardClick?.();
  };

  return (
    <div
      className={clsx(
        'relative flex flex-col bg-white shadow-sm p-4 pb-2 border border-border/50 rounded-lg transition-shadow',
        onForwardClick && 'hover:shadow-md cursor-pointer',
        disabled && 'opacity-50 pointer-events-none',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
