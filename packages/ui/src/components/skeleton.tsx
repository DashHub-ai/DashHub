import type { HTMLAttributes } from 'react';

import clsx from 'clsx';

type Props = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: Props) {
  return (
    <div
      className={clsx('bg-muted/60 rounded-md animate-pulse', className)}
      {...props}
    />
  );
}
