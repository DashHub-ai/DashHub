import { useSidebarToggledStorage } from '../sidebar/use-sidebar-toggled-storage';
import { NavigationRightToolbar } from './navigation-right-toolbar';

export function Navigation() {
  const sidebarToggledStorage = useSidebarToggledStorage();

  return (
    <header className="z-10 relative flex justify-between p-6 w-full h-[80px]">
      <span className="font-dmsans font-semibold text-2xl">
        {!sidebarToggledStorage.getOrNull() && 'DashHub.ai'}
      </span>

      <NavigationRightToolbar />
    </header>
  );
}
