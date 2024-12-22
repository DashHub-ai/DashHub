import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { Footer } from './footer';
import { Navigation } from './navigation';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  contentClassName?: string;
};

export function PageWithNavigationLayout({ children, contentClassName, withFooter = true }: Props) {
  return (
    <main className="md:flex flex-col hidden bg-gray-50 min-h-screen">
      <Navigation />
      <div
        className={clsx(
          'flex-1 space-y-8 mx-auto p-4 pt-6 container',
          contentClassName,
        )}
      >
        {children}
      </div>
      {withFooter && <Footer />}
    </main>
  );
}
