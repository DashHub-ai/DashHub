import type { PropsWithChildren } from 'react';

import clsx from 'clsx';
import { ChevronLeft } from 'lucide-react';

import { LoggedInUserItem } from './logged-in/logged-in-user-item';

type SidebarProps = PropsWithChildren & {
  isOpen?: boolean;
  onClose?: () => void;
};

export function Sidebar({ children, isOpen = true, onClose }: SidebarProps) {
  return (
    <aside
      className={clsx(
        'top-0 left-0 z-40 fixed flex flex-col bg-gray-50 dark:bg-gray-800 p-5 w-[300px] h-screen overflow-y-auto transition-transform',
        {
          'translate-x-0': isOpen,
          '-translate-x-full': !isOpen,
        },
      )}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-dmsans font-semibold text-2xl">
          DashHub.ai
        </h1>

        {onClose && (
          <button
            onClick={onClose}
            type="button"
            className="hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-md"
            aria-label="Close sidebar"
          >
            <ChevronLeft size={18} />
          </button>
        )}
      </div>

      <div className="flex flex-col flex-grow space-y-10 mb-2">
        {children}
      </div>

      <div className="mt-auto">
        <LoggedInUserItem />
      </div>
    </aside>
  );
}
