import type { PropsWithChildren, ReactNode } from 'react';

import { LayoutBreadcrumbs } from './layout-breadcrumbs';

type Props = PropsWithChildren & {
  withBreadcrumbs?: boolean;
  currentBreadcrumb?: ReactNode;
  breadcrumbs?: ReactNode;
  root?: boolean;
};

export function LayoutHeader({ children, currentBreadcrumb, breadcrumbs, withBreadcrumbs = true, root }: Props) {
  return (
    <div className="flex flex-col space-y-3">
      {withBreadcrumbs && (
        <LayoutBreadcrumbs
          currentBreadcrumb={currentBreadcrumb ?? children}
          breadcrumbs={breadcrumbs}
          root={root}
        />
      )}

      {children && (
        <h1 className="font-bold text-3xl line-clamp-1 tracking-tight">
          {children}
        </h1>
      )}
    </div>
  );
}
