import type { ReactNode } from 'react';

import clsx from 'clsx';
import { Link } from 'wouter';

export type SidebarLinkItem = {
  icon?: ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
};

type SidebarLinksProps = {
  links: SidebarLinkItem[];
};

export function SidebarLinks({ links }: SidebarLinksProps) {
  return (
    <ul className="-ml-2">
      {links.map(link => (
        <li key={`${link.label}-${link.href}`}>
          <Link
            href={link.href}
            className={clsx(
              'flex items-center gap-2 p-2 rounded-md w-full text-sm transition-colors',
              {
                'bg-gray-200 dark:bg-gray-700 font-medium': link.isActive,
                'hover:bg-gray-100 dark:hover:bg-gray-700': !link.isActive,
              },
            )}
          >
            {link.icon && (
              <span className={clsx('text-gray-500', {
                'text-gray-900 dark:text-gray-100': link.isActive,
              })}
              >
                {link.icon}
              </span>
            )}

            <span>{link.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
