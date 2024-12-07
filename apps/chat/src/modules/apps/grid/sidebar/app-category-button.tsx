import type { ReactNode } from 'react';

import clsx from 'clsx';
import { ChevronDownIcon } from 'lucide-react';

type Props = {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  count: number;
  isSelected: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  depth?: number;
};

export function AppCategoryButton({
  onClick,
  icon,
  label,
  count,
  isSelected,
  hasChildren,
  isExpanded,
  depth = 0,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex justify-between items-center px-3 py-2 rounded-md w-full text-sm transition-colors',
        isSelected
          ? 'bg-primary/5 text-primary font-semibold'
          : 'hover:bg-muted text-muted-foreground hover:text-foreground',
        depth > 0 && 'pl-6',
      )}
    >
      <span className="flex items-center gap-2">
        {icon}
        {label}
        {hasChildren && (
          <ChevronDownIcon
            size={14}
            className={clsx(
              'transition-transform',
              isExpanded ? 'transform rotate-0' : '-rotate-90',
            )}
          />
        )}
      </span>
      <span className="text-xs">{count}</span>
    </button>
  );
}
