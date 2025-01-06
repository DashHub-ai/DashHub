import type { ReactNode } from 'react';

type CardTitleProps = {
  icon: ReactNode;
  children: ReactNode;
};

export function CardTitle({ icon, children }: CardTitleProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
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
    </div>
  );
}
