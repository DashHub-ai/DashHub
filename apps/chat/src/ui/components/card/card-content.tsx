import type { PropsWithChildren } from 'react';

export function CardContent({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col flex-1 gap-y-4">
      {children}
    </div>
  );
}
