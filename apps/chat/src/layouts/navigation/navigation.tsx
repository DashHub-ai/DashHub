import { useSitemap } from '~/routes/use-sitemap';

import { useSidebarToggledStorage } from '../sidebar/use-sidebar-toggled-storage';
import { NavigationRightToolbar } from './navigation-right-toolbar';
import { NavigationTabs } from './navigation-tabs';

export function Navigation() {
  const sidebarToggledStorage = useSidebarToggledStorage();
  const sitemap = useSitemap();

  return (
    <header className="z-10 relative items-center place-content-center gap-14 grid grid-cols-[1fr_auto_1fr] p-6 w-full h-[80px]">
      <div className="font-dmsans font-semibold text-2xl">
        {!sidebarToggledStorage.getOrNull() && 'DashHub.ai'}
      </div>

      <div>
        <NavigationTabs
          tabs={[
            {
              label: 'Chats',
              path: sitemap.home,
            },
            {
              label: 'Agents',
              path: sitemap.apps.index.generate({}),
            },
            {
              label: 'Projects',
              path: sitemap.projects.index.generate({}),
            },
            {
              label: 'Pins',
              path: sitemap.pinnedMessages.index.generate({}),
            },
          ]}
        />
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
