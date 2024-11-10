import type { PropsWithChildren, ReactNode } from 'react';

import { clsx } from 'clsx';

type Props = PropsWithChildren & {
  suffix?: ReactNode;
  className?: string;
};

export function PaginationToolbar({ children, suffix, className }: Props) {
  return (
    <div className={clsx('flex justify-between items-center', className ?? 'mt-8')}>
      <div className="flex flex-1 gap-4">
        {children}
      </div>

      {suffix && (
        <div className="flex flex-row items-center gap-4">
          {suffix}
        </div>
      )}
    </div>
  );
}
