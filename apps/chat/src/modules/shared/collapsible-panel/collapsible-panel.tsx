import type { ReactNode } from 'react';

import clsx from 'clsx';
import { ChevronRight, Cog } from 'lucide-react';

import { StrictBooleanV } from '@llm/commons';
import { useLocalStorageObject } from '@llm/commons-front';

type Props = {
  storageKey: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultWidth?: string;
};

export function CollapsiblePanel({
  storageKey,
  title,
  icon = <Cog size={16} />,
  children,
  defaultWidth = 'w-[450px]',
}: Props) {
  const collapsedStorage = useLocalStorageObject(`${storageKey}-collapsed`, {
    schema: StrictBooleanV.catch(false),
    readBeforeMount: true,
  });

  const isCollapsed = !!collapsedStorage.getOrNull();

  return (
    <div
      className={clsx(
        'relative border-gray-200 border-l transition-all duration-300',
        isCollapsed ? 'w-12' : defaultWidth,
      )}
    >
      <button
        type="button"
        onClick={() => collapsedStorage.set(!isCollapsed)}
        className="top-[40%] -left-3 absolute flex flex-col items-center gap-2 border-gray-200 bg-white hover:bg-gray-100 shadow-sm px-1 py-4 border rounded-lg -translate-y-1/2"
      >
        {icon}
        <ChevronRight
          size={16}
          className={clsx(
            'transition-transform duration-300',
            isCollapsed ? 'rotate-180' : 'rotate-0',
          )}
        />
      </button>

      <div className="p-4 pl-10">
        <h2 className={clsx(
          'font-semibold text-xl transition-opacity',
          isCollapsed ? 'opacity-0' : 'opacity-100',
        )}
        >
          {title}
        </h2>
      </div>

      <div className={clsx(
        'transition-opacity duration-300',
        isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
      )}
      >
        <div className="px-6 pb-4 pl-10">
          {children}
        </div>
      </div>
    </div>
  );
}
