import type { ComponentPropsWithoutRef } from 'react';

import { clsx } from 'clsx';

type Props = ComponentPropsWithoutRef<'button'> & {
  title: string;
};

export function ActionButton({ children, disabled, ...props }: Props) {
  return (
    <button
      type="button"
      className={clsx(
        'p-1 rounded transition-colors',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200',
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
