import type { ReactNode } from 'react';

import clsx from 'clsx';
import { ChevronDownIcon } from 'lucide-react';

import { isNil } from '@dashhub/commons';

type Props = {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count?: number;
  className?: string;
  isSelected: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  depth?: number;
  suffix?: ReactNode;
};

export function AppCategoryButton(
  {
    onClick,
    icon,
    label,
    count,
    className,
    isSelected,
    hasChildren,
    isExpanded,
    suffix,
    depth = 0,
  }: Props,
) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      className={clsx(
        'flex justify-between items-center px-3 py-2 rounded-md w-full text-sm transition-colors',
        isSelected
          ? 'bg-primary/5 text-primary font-semibold'
          : 'hover:bg-muted hover:text-foreground',
        depth > 0 && 'pl-6',
        className,
      )}
    >
      <span className="flex flex-1 items-center gap-2 min-w-0">
        <span className="flex-shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
        {hasChildren && (
          <ChevronDownIcon
            size={14}
            className={clsx(
              'flex-shrink-0 transition-transform',
              isExpanded ? 'transform rotate-0' : '-rotate-90',
            )}
          />
        )}
        {suffix && (
          <span className="flex flex-row items-center ml-auto">{suffix}</span>
        )}
      </span>
      {!isNil(count) && (
        <span className="flex-shrink-0 ml-2 text-xs">
          {count}
        </span>
      )}
    </button>
  );
}
