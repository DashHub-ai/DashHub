import type { PropsWithChildren, ReactNode } from 'react';

import clsx from 'clsx';
import { Link, useLocation } from 'wouter';

import { dropLastSlash } from '@llm/commons';
import { prefixWithBaseRoute } from '~/routes/use-sitemap';

export type NavigationItemProps = PropsWithChildren & {
  path: string;
  icon: ReactNode;
  disabled?: boolean;
};

export function NavigationItem({ path, icon, children, disabled }: NavigationItemProps) {
  const [location] = useLocation();
  const isActive = (
    path === prefixWithBaseRoute('/')
      ? dropLastSlash(location) === dropLastSlash(path)
      : location.startsWith(path)
  );

  return (
    <li>
      <Link
        href={path}
        aria-disabled={disabled}
        className={clsx(disabled && 'pointer-events-none')}
      >
        <span
          className={clsx(
            'relative flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
            'hover:bg-gray-100',
            isActive && 'bg-gray-100 text-primary',
            disabled && 'text-gray-400',
          )}
        >
          <span className="size-4">
            {icon}
          </span>

          <span>{children}</span>
        </span>
      </Link>
    </li>
  );
}
