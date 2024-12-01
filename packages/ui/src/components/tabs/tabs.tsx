import type { ReactNode } from 'react';

import { type ControlBindProps, controlled } from '@under-control/forms';
import clsx from 'clsx';

type TabId = string | number | boolean;

type TabItem = {
  id: TabId;
  name: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type TabsProps = ControlBindProps<TabId> & {
  className?: string;
  tabs: Array<TabItem>;
};

export const Tabs = controlled<TabId, TabsProps>((
  {
    control: { value, setValue },
    tabs,
    className,
  },
) => {
  return (
    <ul className={clsx('uk-tab-alt', className)}>
      {tabs.map(({ id, name, icon, disabled }) => (
        <li
          key={String(id)}
          className={clsx(
            {
              'uk-active': id === value,
              'opacity-50': disabled,
            },
          )}
        >
          <a
            href=""
            role="button"
            className={clsx(
              'flex flex-row items-center',
              disabled && 'pointer-events-none',
            )}
            onClick={(event) => {
              event.preventDefault();
              if (!disabled) {
                setValue({
                  value: id,
                });
              }
            }}
            aria-disabled={disabled}
          >
            {icon && (
              <span className="mr-2">
                {icon}
              </span>
            )}
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
});
