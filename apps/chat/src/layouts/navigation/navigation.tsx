import clsx from 'clsx';

import { HamburgerMenu } from './hamburger-menu';
import { NavigationLinks } from './links';
import { NavigationRightToolbar } from './navigation-right-toolbar';

export function Navigation() {
  return (
    <header
      className={clsx(
        'z-10 relative items-center place-content-center grid mx-auto w-full h-auto sm:h-[70px] md:h-[80px] container',
        'grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] gap-2 sm:gap-4 md:gap-6',
      )}
    >
      <div className="font-dmsans font-semibold text-lg sm:text-xl md:text-2xl">
        DashHub.AI
      </div>

      <div className="hidden lg:flex flex-wrap justify-center overflow-visible">
        <NavigationLinks />
      </div>

      <div className="flex flex-row justify-end items-center gap-2 sm:gap-6 md:gap-14">
        <NavigationRightToolbar />
        <HamburgerMenu />
      </div>
    </header>
  );
}
