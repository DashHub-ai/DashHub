import type { ReactNode } from 'react';

import clsx from 'clsx';

type SelectableBadgeItemProps = {
  name: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  isSelected: boolean;
  onClick: (event: React.MouseEvent) => void;
};

export function SelectableBadgeItem({
  name,
  icon,
  disabled,
  isSelected,
  onClick,
}: SelectableBadgeItemProps) {
  return (
    <div
      className={clsx(
        'px-3 py-1 rounded-full transition-all cursor-pointer',
        'border border-gray-200 text-sm',
        {
          'bg-primary text-white border-primary': isSelected,
          'bg-white text-gray-700 hover:bg-gray-100': !isSelected,
          'opacity-50 cursor-not-allowed': disabled,
        },
      )}
      onClick={onClick}
      role="button"
      aria-pressed={isSelected}
      aria-disabled={disabled}
    >
      <div className="flex items-center gap-1">
        {icon && <span className="flex items-center">{icon}</span>}
        <span>{name}</span>
      </div>
    </div>
  );
}
