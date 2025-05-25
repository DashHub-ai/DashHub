import type { ReactNode } from 'react';

import { type ControlBindProps, controlled } from '@under-control/forms';
import clsx from 'clsx';

import { SectionTabButton } from './section-tab-button';

export type SectionTabId = string | number | boolean;

export type SectionTabItem = {
  id: SectionTabId;
  name: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  content: () => ReactNode;
};

export type SectionTabsProps = ControlBindProps<SectionTabId> & {
  className?: string;
  tabs: Array<SectionTabItem>;
  resetSearchParamsOnChange?: boolean;
};

export const SectionTabs = controlled<SectionTabId, SectionTabsProps>((
  {
    control: { value, setValue },
    tabs,
    className,
    resetSearchParamsOnChange = true,
  },
) => {
  const activeTab = tabs.find(tab => tab.id === value);

  const handleTabClick = (id: SectionTabId) => {
    if (resetSearchParamsOnChange) {
      const { origin, pathname } = window.location;

      window.history.replaceState({}, '', `${origin}${pathname}`);
    }

    setValue({ value: id });
  };

  return (
    <>
      <div className={clsx('border-gray-200 dark:border-gray-700 border-b', className)}>
        <ul className="flex justify-center space-x-6 -mb-px" role="tablist">
          {tabs.map(({ id, name, icon, disabled }) => (
            <li key={String(id)} role="presentation">
              <SectionTabButton
                id={id}
                name={name}
                icon={icon}
                disabled={disabled}
                isActive={id === value}
                onClick={() => handleTabClick(id)}
              />
            </li>
          ))}
        </ul>
      </div>

      {activeTab?.content && (
        <div className="mt-6">
          {activeTab.content()}
        </div>
      )}
    </>
  );
});
