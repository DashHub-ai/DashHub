import type { PropsWithChildren } from 'react';

import clsx from 'clsx';
import { Link, useLocation } from 'wouter';

import { UkIcon } from '~/icons';

type Props = PropsWithChildren & {
  path: string;
  icon: string;
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
          <UkIcon icon={icon} />
        </span>

        {children}
      </Link>
    </li>
  );
}
