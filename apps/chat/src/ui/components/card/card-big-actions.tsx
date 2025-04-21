import type { ReactNode } from 'react';

type CardBigActionsProps = {
  children: ReactNode;
};

export function CardBigActions({ children }: CardBigActionsProps) {
  return (
    <div className="flex flex-col gap-2 mt-auto">
      {children}
    </div>
  );
}
