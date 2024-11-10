import type { PropsWithChildren } from 'react';

import { Navigation } from './navigation';

export function PageWithNavigationLayout({ children }: PropsWithChildren) {
  return (
    <main className="hidden flex-col md:flex min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex-1 space-y-8 p-4 pt-6 container mx-auto">
        {children}
      </div>
    </main>
  );
}
