import type { ReactNode } from 'react';

import clsx from 'clsx';

import type { SectionTabId } from './section-tabs';

export type SectionTabButtonProps = {
  id: SectionTabId;
  name: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
  isActive: boolean;
  onClick: (id: SectionTabId) => void;
};

export function SectionTabButton(
  {
    id,
    name,
    icon,
    disabled,
    className,
    isActive,
    onClick,
  }: SectionTabButtonProps,
) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-disabled={disabled}
      disabled={disabled}
      className={clsx(
        'flex items-center gap-2 px-4 py-3 border-b-2 focus:outline-none font-semibold text-sm whitespace-nowrap',
        className,
        isActive
          ? 'border-black text-black dark:text-white dark:border-white'
          : 'border-transparent text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300',
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
      )}
      onClick={(event) => {
        event.preventDefault();
        if (!disabled) {
          onClick(id);
        }
      }}
    >
      {icon && (
        <span>
          {icon}
        </span>
      )}
      {name}
    </button>
  );
}
