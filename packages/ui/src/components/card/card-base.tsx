import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

type CardBaseProps = PropsWithChildren & {
  className?: string;
};

export function CardBase({ children, className }: CardBaseProps) {
  return (
    <div className={clsx(
      'relative flex flex-col bg-white shadow-sm hover:shadow-md p-4 pb-2 border border-border/50 rounded-lg transition-shadow',
      className,
    )}
    >
      {children}
    </div>
  );
}
