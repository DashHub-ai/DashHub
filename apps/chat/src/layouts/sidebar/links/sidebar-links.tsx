import type { ReactNode } from 'react';

import clsx from 'clsx';
import { Link, useLocation } from 'wouter';

import { useI18n } from '~/i18n';

export type SidebarLinkItem = {
  icon?: ReactNode;
  label: string;
  href: string;
  suffix?: ReactNode;
};

type SidebarLinksProps = {
  links: SidebarLinkItem[];
};

export function SidebarLinks({ links }: SidebarLinksProps) {
  const { pack } = useI18n();
  const [location] = useLocation();

  if (!links.length) {
    return (
      <div className="flex justify-center items-center p-4 w-full h-full text-muted-foreground text-sm">
        {pack.sidebar.noLinksAvailable}
      </div>
    );
  }

  return (
    <ul>
      {links.map((link) => {
        const isActive = location.startsWith(link.href);

        return (
          <li key={`${link.label}-${link.href}`}>
            <Link
              href={link.href}
              className={clsx(
                'flex items-center gap-2 p-2 rounded-md w-full text-sm transition-colors',
                {
                  'bg-gray-200 dark:bg-gray-700 font-medium': isActive,
                  'hover:bg-gray-100 dark:hover:bg-gray-700': !isActive,
                },
              )}
            >
              {link.icon && (
                <span
                  className={clsx('flex-shrink-0 text-gray-500', {
                    'text-gray-900 dark:text-gray-100': isActive,
                  })}
                >
                  {link.icon}
                </span>
              )}

              <span className="flex-1 min-w-0 truncate">
                {link.label}
              </span>

              {link.suffix && <span className="ml-2">{link.suffix}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
