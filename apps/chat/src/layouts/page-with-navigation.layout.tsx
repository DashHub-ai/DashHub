import type { PropsWithChildren } from 'react';

import { Footer } from './footer';
import { Navigation } from './navigation';

export function PageWithNavigationLayout({ children }: PropsWithChildren) {
  return (
    <main className="md:flex flex-col hidden bg-gray-50 min-h-screen">
      <Navigation />
      <div className="flex-1 space-y-8 mx-auto p-4 pt-6 container">
        {children}
      </div>
      <Footer />
    </main>
  );
}
