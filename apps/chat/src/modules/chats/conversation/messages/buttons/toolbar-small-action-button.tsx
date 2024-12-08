import type { ComponentPropsWithoutRef } from 'react';

import { clsx } from 'clsx';

type Props = ComponentPropsWithoutRef<'button'> & {
  title: string;
  darkMode?: boolean;
};

export function ToolbarSmallActionButton({ children, disabled, darkMode, ...props }: Props) {
  return (
    <button
      type="button"
      className={clsx(
        'p-1 rounded transition-colors',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : (darkMode
              ? 'hover:bg-gray-600'
              : 'hover:bg-gray-200'),
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
