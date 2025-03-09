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
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>{pack.navigation.backToHome}</span>
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
