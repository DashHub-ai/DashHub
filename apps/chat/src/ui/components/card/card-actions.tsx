import type { ReactNode } from 'react';

type CardActionsProps = {
  children: ReactNode;
};

export function CardActions({ children }: CardActionsProps) {
  return (
    <>
      <div className="bg-slate-200/70 -mx-4 my-2 h-[1px]" />
      <div className="flex flex-row gap-2">
        {children}
      </div>
    </>
  );
}
