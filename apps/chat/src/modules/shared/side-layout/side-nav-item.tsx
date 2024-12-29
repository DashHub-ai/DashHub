import type { PropsWithChildren, ReactNode } from 'react';

import { clsx } from 'clsx';

type SideNavItemProps = PropsWithChildren & {
  icon: ReactNode;
  isActive?: boolean;
  onClick: () => void;
};

export function SideNavItem({ icon, isActive, onClick, children }: SideNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 px-3 py-2 rounded-md w-full text-sm transition-colors',
        isActive
          ? 'bg-primary text-white'
          : 'text-muted-foreground hover:bg-gray-100',
      )}
    >
      {icon}
      {children}
    </button>
  );
}
