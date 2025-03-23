import type { PropsWithChildren, ReactNode } from 'react';

import { clsx } from 'clsx';

export type PaginationToolbarProps = PropsWithChildren & {
  suffix?: ReactNode;
  className?: string;
};

export function PaginationToolbar({ children, suffix, className }: PaginationToolbarProps) {
  return (
    <div className={clsx('flex flex-wrap justify-between items-center gap-4', className)}>
      <div className="flex flex-1 gap-4">
        {children}
      </div>

      {suffix && (
        <div className="flex flex-row items-center gap-4 max-h-[32px]">
          {suffix}
        </div>
      )}
    </div>
  );
}
