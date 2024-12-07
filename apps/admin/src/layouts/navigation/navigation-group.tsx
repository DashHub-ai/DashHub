import type { ReactNode } from 'react';

import clsx from 'clsx';
import { ChevronDownIcon } from 'lucide-react';
import { Link, useLocation } from 'wouter';

import { NavigationItem } from './navigation-item';

type NavigationLink = {
  path: string;
  icon: ReactNode;
  label: string;
};

type Props = {
  icon: ReactNode;
  label: string;
  items: NavigationLink[];
};

export function NavigationGroup({ icon, label, items }: Props) {
  const [location] = useLocation();
  const active = items.some(item => item.path === location);

  return (
    <li className="relative group">
      <NavigationItem
        as="a"
        icon={icon}
        active={active}
        path=""
        className="group-hover:bg-gray-50"
      >
        <span className="flex items-center gap-1">
          {label}
          <ChevronDownIcon
            size={16}
            className={clsx(
              'group-hover:rotate-180 transition-transform',
              active && 'rotate-180',
            )}
          />
        </span>
      </NavigationItem>

      <div className="group-hover:block left-0 z-50 absolute hidden pt-2 text-sm">
        <ul className="bg-white shadow-lg py-2 border rounded-md min-w-[200px]">
          {items.map(item => (
            <li key={item.path}>
              <Link
                key={item.path}
                href={item.path}
                className={clsx(
                  'flex items-center gap-2 hover:bg-gray-100 px-4 py-2 transition-colors',
                  location === item.path && 'text-primary bg-gray-50',
                )}
              >
                <span className="size-4">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
