import type { PropsWithChildren, ReactNode } from 'react';

import clsx from 'clsx';
import { Link, useLocation } from 'wouter';

type Props = PropsWithChildren & {
  path: string;
  icon: ReactNode;
};

export function NavigationItem({ path, icon, children }: Props) {
  const [location] = useLocation();

  const assignClassIfActive = (path: string) => ({
    className: clsx(location === path && 'uk-active'),
  });

  return (
    <li {...assignClassIfActive(path)}>
      <Link href={path}>
        <span className="mr-1 size-4">
          {icon}
        </span>

        {children}
      </Link>
    </li>
  );
}
