import { Construction } from 'lucide-react';

import { NavigationItem, type NavigationItemProps } from './navigation-item';

export function StayTunedNavigationItem({ path, icon, children }: NavigationItemProps) {
  return (
    <NavigationItem
      path={path}
      icon={icon}
      disabled
    >
      <span className="flex items-center gap-2 w-full">
        <span>{children}</span>
        <span className="bg-gray-100 ml-auto px-2 py-1 rounded-full">
          <Construction className="text-gray-400 size-4" />
        </span>
      </span>
    </NavigationItem>
  );
}
