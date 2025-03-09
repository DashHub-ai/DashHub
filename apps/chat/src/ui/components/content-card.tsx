import type { PropsWithChildren, ReactNode } from 'react';

import clsx from 'clsx';

type Props = PropsWithChildren & {
  title: string;
  toolbar?: ReactNode;
  flat?: boolean;
};

export function ContentCard({ title, toolbar, children, flat = true }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">{title}</h2>
        {toolbar && (
          <div className="flex items-center gap-2">
            {toolbar}
          </div>
        )}
      </div>

      <div
        className={clsx(
          'relative flex flex-col',
          !flat && 'bg-white shadow-sm p-6 border border-border/50 rounded-lg',
        )}
      >
        {children}
      </div>
    </div>
  );
}
