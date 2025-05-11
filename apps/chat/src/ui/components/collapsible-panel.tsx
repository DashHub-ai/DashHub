import type { ReactNode } from 'react';

import clsx from 'clsx';
import { Cog } from 'lucide-react';

import { StrictBooleanV } from '@dashhub/commons';
import { useLocalStorageObject } from '@dashhub/commons-front';

type Props = {
  storageKey: string;
  contentClassName?: string;
  title: string;
  defaultCollapsed?: boolean;
  children: ReactNode;
  defaultWidth?: string;
};

export function CollapsiblePanel(
  {
    storageKey,
    contentClassName,
    title,
    children,
    defaultCollapsed = false,
    defaultWidth = 'w-[450px]',
  }: Props,
) {
  const collapsedStorage = useLocalStorageObject(`${storageKey}-collapsed`, {
    schema: StrictBooleanV.catch(defaultCollapsed),
    readBeforeMount: true,
  });

  const isCollapsed = !!collapsedStorage.getOrNull();

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => collapsedStorage.set(!isCollapsed)}
        className="top-3 right-4 absolute hover:bg-gray-100 p-1.5 rounded-full text-gray-500 hover:text-gray-700"
      >
        <Cog size={20} />
      </button>

      <div
        className={clsx(
          'transition-all duration-300',
          isCollapsed ? 'w-12' : defaultWidth,
          contentClassName,
        )}
      >
        <div className="p-4 pt-0 pr-14 pl-10">
          <h2
            className={clsx(
              'font-semibold text-xl transition-opacity',
              isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
            )}
          >
            {title}
          </h2>
        </div>

        <div
          className={clsx(
            'transition-opacity duration-300',
            isCollapsed ? 'opacity-0 hidden' : 'opacity-100',
          )}
        >
          <div className="px-6 pb-4 pl-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
