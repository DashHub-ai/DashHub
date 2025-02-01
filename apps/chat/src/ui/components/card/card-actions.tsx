import type { ReactNode } from 'react';

type CardActionsProps = {
  children: ReactNode;
};

export function CardActions({ children }: CardActionsProps) {
  return (
    <>
      <div className="-mx-4 my-2 bg-border/50 h-px" />
      <div className="flex flex-row gap-2">
        {children}
      </div>
    </>
  );
}
