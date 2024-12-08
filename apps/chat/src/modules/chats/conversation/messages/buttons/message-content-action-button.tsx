import type { ComponentPropsWithoutRef } from 'react';

import { clsx } from 'clsx';
import { CheckIcon, ForwardIcon } from 'lucide-react';
import { useState } from 'react';

type Props = ComponentPropsWithoutRef<'button'> & {
  darkMode?: boolean;
  disabled?: boolean;
};

export function MessageContentActionButton({ children, darkMode, disabled, className, onClick, ...props }: Props) {
  const [wasClicked, setWasClicked] = useState(false);

  return (
    <button
      type="button"
      className={clsx(
        'flex flex-row items-center gap-2 px-3 py-1.5 border rounded-md font-medium text-sm transition-colors',
        darkMode
          ? 'hover:bg-gray-400 text-white border-gray-500'
          : 'hover:bg-gray-200 text-gray-800 border-gray-300',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        wasClicked && (darkMode
          ? 'bg-purple-800/40 hover:bg-purple-700/40 border-purple-600/50'
          : 'bg-purple-50 hover:bg-purple-100/80 border-purple-200 text-purple-900'),
        className,
      )}
      disabled={disabled}
      onClick={(e) => {
        setWasClicked(true);
        onClick?.(e);
      }}
      {...props}
    >
      {(
        wasClicked
          ? <CheckIcon size={16} className="text-purple-500" />
          : <ForwardIcon size={16} />
      )}
      {children}
    </button>
  );
}
