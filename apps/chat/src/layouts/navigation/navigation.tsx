import type { ReactNode } from 'react';

import clsx from 'clsx';
import { Link } from 'wouter';

import { useSitemap } from '~/routes';

import { HamburgerMenu } from './hamburger-menu';
import { NavigationLinks } from './links';
import { NavigationRightToolbar } from './navigation-right-toolbar';

export type NavigationProps = {
  withAdditionalUI?: boolean;
  breadcrumbs?: ReactNode;
};

export function Navigation({ withAdditionalUI, breadcrumbs }: NavigationProps) {
  const sitemap = useSitemap();

  return (
    <header
      className={clsx(
        'z-40 relative items-center place-content-center grid mx-auto w-full h-auto sm:h-[70px] md:h-[80px] container',
        'grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 md:gap-6',
      )}
    >
      <Link
        className="font-dmsans font-semibold text-lg sm:text-xl md:text-xl"
        href={sitemap.home}
      >
        <span>Dash</span>
        <span
          className="bg-clip-text bg-gradient-to-r from-[#e1727d] to-[#f2b535] text-transparent"
        >
          Hub
        </span>
        <span>.ai</span>
      </Link>

      <div
        className={clsx(
          'hidden lg:flex flex-wrap overflow-visible',
          withAdditionalUI
            ? 'justify-start'
            : 'justify-center',
        )}
      >
        {(
          withAdditionalUI
            ? <div className="empty:hidden ml-5">{breadcrumbs}</div>
            : <NavigationLinks />
        )}
      </div>

      <div className="flex flex-row justify-end items-center gap-2 sm:gap-6 md:gap-14">
        <NavigationRightToolbar>
          {withAdditionalUI && (
            <div id="navigation-toolbar" />
          )}
        </NavigationRightToolbar>

        <HamburgerMenu className="lg:hidden" />
      </div>
    </header>
  );
}
