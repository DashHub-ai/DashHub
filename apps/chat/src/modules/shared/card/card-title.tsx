import type { ReactNode } from 'react';

type CardTitleProps = {
  icon: ReactNode;
  children: ReactNode;
};

export function CardTitle({ icon, children }: CardTitleProps) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="text-muted-foreground">
        {icon}
      </div>
      <h3
        className="flex flex-row items-center gap-2 line-clamp-1 font-medium"
        {...typeof children === 'string' ? { title: children } : {}}
      >
        {children}
      </h3>
    </div>
  );
}
