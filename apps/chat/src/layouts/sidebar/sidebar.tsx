import type { PropsWithChildren } from 'react';

import clsx from 'clsx';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import { LoggedInUserItem } from './logged-in';
import { useSidebarToggledStorage } from './use-sidebar-toggled-storage';

export function Sidebar({ children }: PropsWithChildren) {
  const sidebarToggledStorage = useSidebarToggledStorage();

  if (!sidebarToggledStorage.getOrNull()) {
    return (
      <aside>
        <div className="bottom-0 left-0 fixed p-4">
          <button
            type="button"
            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md text-gray-500"
            onClick={() => {
              sidebarToggledStorage.set(true);
            }}
          >
            <PanelLeftOpen size={18} />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <div className="relative w-[300px]">
      <aside
        className={clsx(
          'top-0 left-0 fixed flex flex-col bg-gray-50 dark:bg-gray-800',
          'px-4 pt-4 pb-4 w-[inherit] h-screen transition-transform',
        )}
      >
        <div className="mb-7 p-2 font-dmsans font-semibold text-2xl">
          DashHub.ai
        </div>

        <div className="flex flex-col flex-grow space-y-10 mb-2 overflow-y-auto">
          {children}
        </div>

        <div className="flex justify-between items-center mt-auto">
          <LoggedInUserItem />

          <button
            type="button"
            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md text-gray-500"
            onClick={() => {
              sidebarToggledStorage.set(false);
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>
      </aside>
    </div>
  );
}
