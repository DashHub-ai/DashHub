import type { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { Footer } from './footer';
import { Sidebar } from './sidebar';

type Props = PropsWithChildren & {
  withFooter?: boolean;
  wrapWithContainer?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
};

export function PageWithSidebarLayout(
  {
    children,
    contentClassName,
    backgroundClassName = 'bg-gray-50',
    wrapWithContainer = true,
    withFooter = true,
  }: Props,
) {
  return (
    <main className={clsx('flex min-h-screen', backgroundClassName)}>
      <Sidebar />

      <div className="flex flex-col flex-1">
        <div
          className={clsx(
            'flex-1 mx-auto p-6 w-full',
            wrapWithContainer && 'container max-w-6xl',
            contentClassName,
          )}
        >
          {children}
        </div>

        {withFooter && <Footer />}
      </div>
    </main>
  );
}
