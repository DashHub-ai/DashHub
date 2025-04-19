import type { ReactNode } from 'react';

import clsx from 'clsx';

type CardFooterProps = {
  children: ReactNode;
  alignEnd?: boolean;
};

export function CardFooter({ children, alignEnd = true }: CardFooterProps) {
  return (
    <div
      className={clsx(
        'flex flex-row justify-between items-center py-1',
        alignEnd && 'mt-auto',
      )}
    >
      {children}
    </div>
  );
}
