import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { clsx } from 'clsx';

type Props = ComponentPropsWithoutRef<'button'> & {
  title: string;
  icon?: ReactNode;
  darkMode?: boolean;
};

export function ToolbarSmallActionButton({ children, icon, title, disabled, darkMode, ...props }: Props) {
  return (
    <button
      type="button"
      className={clsx(
        'flex items-center gap-1.5 bg-gray-100/50 px-2 py-1.5 rounded-md text-gray-600 text-xs transition-all',
        'hover:scale-105 active:scale-95',
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : (darkMode
              ? 'hover:bg-gray-600/50'
              : 'hover:bg-gray-200/70'),
      )}
      disabled={disabled}
      {...props}
    >
      {icon ?? children}
      <span>{title}</span>
    </button>
  );
}
