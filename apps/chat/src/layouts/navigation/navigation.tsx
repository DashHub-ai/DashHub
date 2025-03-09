import { useSidebarToggledStorage } from '../sidebar/use-sidebar-toggled-storage';
import { NavigationRightToolbar } from './navigation-right-toolbar';
import { NavigationWorkspaceSelector } from './navigation-workspace-selector';

export function Navigation() {
  const sidebarToggledStorage = useSidebarToggledStorage();

  return (
    <header className="z-10 relative flex justify-between p-6 w-full h-[80px]">
      <div className="flex flex-row gap-10">
        <span className="font-dmsans font-semibold text-2xl">
          {!sidebarToggledStorage.getOrNull() && 'DashHub.ai'}
        </span>

        <NavigationWorkspaceSelector />
      </div>

      <NavigationRightToolbar />
    </header>
  );
}
