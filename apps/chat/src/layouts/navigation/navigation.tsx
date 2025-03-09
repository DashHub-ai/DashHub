import { useSidebarToggledStorage } from '../sidebar/use-sidebar-toggled-storage';
import { NavigationLinks } from './links';
import { NavigationRightToolbar } from './navigation-right-toolbar';

export function Navigation() {
  const sidebarToggledStorage = useSidebarToggledStorage();

  return (
    <header className="z-10 relative items-center place-content-center gap-14 grid grid-cols-[1fr_auto_1fr] p-6 w-full h-[80px]">
      <div className="font-dmsans font-semibold text-2xl">
        {!sidebarToggledStorage.getOrNull() && 'DashHub.ai'}
      </div>

      <div>
        <NavigationLinks />
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
