import type { ReactNode } from 'react';

type CardFooterProps = {
  children: ReactNode;
};

export function CardFooter({ children }: CardFooterProps) {
  return (
    <div className="flex flex-row justify-between items-center mt-auto py-1">
      {children}
    </div>
  );
}
