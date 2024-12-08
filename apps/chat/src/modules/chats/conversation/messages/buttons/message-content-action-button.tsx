import type { ComponentPropsWithoutRef } from 'react';

import { clsx } from 'clsx';

type Props = ComponentPropsWithoutRef<'button'> & {
  icon: JSX.Element;
  darkMode?: boolean;
};

export function MessageContentActionButton({ children, icon, darkMode, className, ...props }: Props) {
  return (
    <button
      type="button"
      className={clsx(
        'flex flex-row items-center gap-2 px-3 py-1.5 border rounded-md font-medium text-sm transition-colors',
        darkMode
          ? 'hover:bg-gray-400 text-white border-gray-500'
          : 'hover:bg-gray-200 text-gray-800 border-gray-300',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
