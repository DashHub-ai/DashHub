import type { PropsWithChildren, ReactNode } from 'react';

type Props = PropsWithChildren & {
  suffix?: ReactNode;
};

export function PaginationToolbar({ children, suffix }: Props) {
  return (
    <div className="mt-8 flex items-center justify-between">
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
