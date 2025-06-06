import type { PropsWithChildren } from 'react';

import clsx from 'clsx';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Link } from 'wouter';

import { useSitemap } from '~/routes';

import { ChooseLanguageItem } from './choose-language-item';
import { LoggedInUserItem } from './logged-in';
import { SidebarWorkspaceSelector } from './sidebar-workspace-selector';
import { useSidebarToggledStorage } from './use-sidebar-toggled-storage';

export function Sidebar({ children }: PropsWithChildren) {
  const sitemap = useSitemap();
  const sidebarToggledStorage = useSidebarToggledStorage();

  if (!sidebarToggledStorage.getOrNull()) {
    return (
      <aside className="top-0 left-0 fixed flex flex-col">
        <div className="xl:hidden bottom-0 left-0 fixed p-4">
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

        <button
          type="button"
          className={clsx(
            'group hidden xl:block top-1/2 left-0 z-50 fixed bg-gray-800/60 hover:bg-gray-800 hover:dark:bg-gray-900 dark:bg-gray-900/60',
            '-ml-4 hover:-ml-3 rounded-r-full outline-none w-10 h-20 transition-all -translate-y-1/2 duration-300',
          )}
          onClick={() => {
            sidebarToggledStorage.set(true);
          }}
        >
          <div className="flex justify-end items-center pr-2 h-full">
            <PanelLeftOpen className="text-gray-300" size={16} />
          </div>
        </button>
      </aside>
    );
  }

  return (
    <aside
      className={clsx(
        'top-0 left-0 fixed flex flex-col bg-gray-50 dark:bg-gray-800',
        'px-4 pt-4 pb-4 w-[inherit] h-screen transition-transform z-50',
        'shadow-lg shadow-gray-300 dark:shadow-gray-900 2xl:shadow-none',
        'w-[300px] max-w-[300px]',
      )}
    >
      <Link
        className="mb-4 font-dmsans font-semibold text-lg sm:text-xl md:text-2xl"
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

      <div className="gap-4 grid grid-cols-[170px_auto] mb-4 p-2">
        <SidebarWorkspaceSelector />
        <ChooseLanguageItem />
      </div>

      <div className="flex flex-col flex-grow mb-2 pb-6 overflow-y-auto">
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
  );
}
