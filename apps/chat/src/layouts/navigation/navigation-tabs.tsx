import clsx from 'clsx';
import React from 'react';
import { Link, useLocation } from 'wouter';

type NavigationTab = {
  label: string;
  path: string;
  icon?: React.ReactNode;
};

type Props = {
  tabs: NavigationTab[];
  className?: string;
};

export function NavigationTabs(
  {
    tabs,
    className = '',
  }: Props,
) {
  const [location] = useLocation();

  return (
    <nav className={clsx('flex p-0.5 border border-gray-200 rounded-lg', className)}>
      {tabs.map((tab) => {
        const isActive = location === tab.path;

        return (
          <Link
            key={tab.path}
            href={tab.path}
            className={clsx(
              'flex justify-center items-center px-3 py-1 rounded-md font-medium text-sm transition-colors',
              {
                'bg-gray-100 text-gray-900': isActive,
                'text-gray-600 hover:text-gray-900 hover:bg-gray-50': !isActive,
              },
            )}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
