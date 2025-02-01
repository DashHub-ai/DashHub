import type { HTMLAttributes } from 'react';

import clsx from 'clsx';

type Props = HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'dark';
  as?: any;
};

export function Skeleton({ as: Component = 'div', className, variant = 'default', ...props }: Props) {
  return (
    <Component
      className={clsx(
        'inline-flex rounded-md animate-pulse',
        {
          'bg-muted/60': variant === 'default',
          'bg-gray-200': variant === 'dark',
        },
        className,
      )}
      {...props}
    />
  );
}
