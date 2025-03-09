import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

import { useI18n } from '~/i18n';

import { useSidebarToggledStorage } from '../sidebar/use-sidebar-toggled-storage';
import { NavigationLinks } from './links';
import { NavigationRightToolbar } from './navigation-right-toolbar';

export type NavigationProps = {
  simplified?: boolean;
};

export function Navigation({ simplified }: NavigationProps) {
  const { pack } = useI18n();
  const sidebarToggledStorage = useSidebarToggledStorage();

  return (
    <header
      className={clsx(
        'z-10 relative items-center place-content-center gap-14 grid mx-auto p-6 px-14 w-full h-[80px] container',
        sidebarToggledStorage.getOrNull()
          ? 'grid-cols-[1fr_auto]'
          : 'grid-cols-[1fr_auto_1fr]',
      )}
    >
      {!sidebarToggledStorage.getOrNull() && (
        <div className="font-dmsans font-semibold text-2xl">
          Dashhub.ai
        </div>
      )}

      <div>
        {simplified && (
          <Link href="/" className="inline-flex justify-center items-center gap-2 hover:bg-gray-100 disabled:opacity-50 px-4 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 ring-offset-white focus-visible:ring-offset-2 font-medium text-gray-900 hover:text-gray-900 text-sm transition-colors disabled:pointer-events-none">
            <ArrowLeft className="w-4 h-4" />
            {pack.navigation.backToHome}
          </Link>
        )}
        {!simplified && <NavigationLinks />}
      </div>

      <div className="flex flex-row justify-end gap-14">
        <div
          id="navigation-toolbar"
          className="flex justify-center items-center"
        />

        <NavigationRightToolbar />
      </div>
    </header>
  );
}
