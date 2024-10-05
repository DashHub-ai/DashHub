import { type ControlBindProps, controlled } from '@under-control/forms';
import clsx from 'clsx';

type TabId = string | number | boolean;

type TabItem = {
  id: TabId;
  name: string;
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
      {tabs.map(({ id, name }) => (
        <li
          key={String(id)}
          className={clsx(
            {
              'uk-active': id === value,
            },
          )}
        >
          <a
            href=""
            role="button"
            onClick={(event) => {
              event.preventDefault();
              setValue({
                value: id,
              });
            }}
          >
            {name}
          </a>
        </li>
      ))}
    </ul>
  );
});
