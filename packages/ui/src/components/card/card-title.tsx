import type { PropsWithChildren, ReactNode } from 'react';

import clsx from 'clsx';

type CardTitleProps = PropsWithChildren & {
  icon: ReactNode;
  className?: string;
  suffix?: ReactNode;
};

export function CardTitle({ icon, children, className, suffix }: CardTitleProps) {
  return (
    <div className={clsx('flex items-center gap-2 mb-4', className)}>
      <div className="flex-shrink-0 text-muted-foreground">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <h3
          className="font-medium text-base truncate"
          {...typeof children === 'string' ? { title: children } : {}}
        >
          {children}
        </h3>
      </div>

      {suffix}
    </div>
  );
}
