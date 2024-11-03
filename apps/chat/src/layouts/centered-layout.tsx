import type { PropsWithChildren } from 'react';

export function CenteredLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex items-center justify-center h-full min-h-screen py-4">
      {children}
    </div>
  );
}
