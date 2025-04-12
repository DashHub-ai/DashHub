import type { PropsWithChildren, ReactNode } from 'react';

import clsx from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';

import { useSidebarSectionsStorage } from './use-sidebar-sections-storage';

type SidebarSectionProps = PropsWithChildren & {
  className?: string;
  title: string;
  icon: ReactNode;
  id: string;
  defaultExpanded?: boolean;
};

export function SidebarSection(
  {
    className,
    title,
    icon,
    children,
    id,
    defaultExpanded = true,
  }: SidebarSectionProps,
) {
  const { isSectionExpanded, toggleSection } = useSidebarSectionsStorage();
  const isExpanded = isSectionExpanded(id) ?? defaultExpanded;

  return (
    <section
      className={clsx(
        className,
        isExpanded ? 'mb-6' : 'mb-3',
        'last:mb-0',
      )}
    >
      <div
        className={clsx(
          'flex justify-between items-center px-3 py-1.5 rounded cursor-pointer',
          'hover:bg-gray-100 transition-colors duration-150',
          isExpanded && 'mb-2',
        )}
        onClick={() => toggleSection(id)}
      >
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <h3 className="font-dmsans font-semibold text-sm">
            {title}
          </h3>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700 transition-colors"
          type="button"
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2 pl-1">
          {children}
        </div>
      )}
    </section>
  );
}
