import type { ButtonHTMLAttributes } from 'react';

import clsx from 'clsx';

type BalloonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: any;
};

export function BalloonButton({ className, as: Component = 'button', type = 'button', ...props }: BalloonButtonProps) {
  return (
    <Component
      type={type}
      className={clsx(
        'flex flex-row gap-1 px-2 py-0.5 rounded text-xs',
        'border border-white/20 hover:border-white/40',
        'bg-transparent hover:bg-white/5',
        'transition-colors',
        className,
      )}
      {...props}
    />
  );
}
