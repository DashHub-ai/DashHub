import type { PropsWithChildren } from 'react';

export function LayoutHeader({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col space-y-3">
      {children && (
        <h1 className="font-bold text-3xl line-clamp-1 tracking-tight">
          {children}
        </h1>
      )}
    </div>
  );
}
