import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { Footer } from './footer';
import { Navigation } from './navigation';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  wrapWithContainer?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
};

export function PageWithNavigationLayout(
  {
    children,
    contentClassName,
    backgroundClassName = 'bg-gray-50',
    wrapWithContainer = true,
    withFooter = true,
  }: Props,
) {
  return (
    <main className={clsx('md:flex flex-col hidden min-h-screen', backgroundClassName)}>
      <Navigation />

      <div
        className={clsx(
          'flex-1 space-y-8 mx-auto p-4 pt-6',
          wrapWithContainer && 'container',
          contentClassName,
        )}
      >
        {children}
      </div>
      {withFooter && <Footer />}
    </main>
  );
}
